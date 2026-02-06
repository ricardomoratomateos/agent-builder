import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NodeExecutor } from './node-executor';
import { ExecutionCacheService } from '../cache/execution-cache.service';
import { CacheKeyGenerator } from '../cache/cache-key-generator';
import { ExecutionState, ExecutionStateDocument } from '../schemas/execution-state.schema';
import { NodeResult, NodeResultDocument } from '../schemas/node-result.schema';
import { WorkflowsService } from '../../workflows/workflows.service';

@Injectable()
export class DebugExecutor {
  constructor(
    @InjectModel(ExecutionState.name)
    private executionStateModel: Model<ExecutionStateDocument>,
    @InjectModel(NodeResult.name)
    private nodeResultModel: Model<NodeResultDocument>,
    private nodeExecutor: NodeExecutor,
    private executionCache: ExecutionCacheService,
    private cacheKeyGenerator: CacheKeyGenerator,
    private workflowsService: WorkflowsService,
  ) {}

  async executeNextNode(sessionId: string): Promise<any> {
    // 1. Load session state
    const session = await this.executionStateModel.findById(sessionId);
    if (!session) {
      throw new NotFoundException('Debug session not found');
    }

    // 2. Load workflow
    const workflow = await this.workflowsService.findOne(session.workflowId);

    // 3. Determine current node (follow edges, not array index)
    let currentNode;

    console.log('🚀 ExecuteNextNode - currentNodeIndex:', session.currentNodeIndex);
    console.log('🚀 Workflow nodes:', workflow.nodes.map((n: any) => ({ id: n.id, type: n.type, name: n.name })));

    if (session.currentNodeIndex === 0) {
      // First execution: find Start node
      currentNode = workflow.nodes.find((n: any) => n.type === 'start');
      if (!currentNode) {
        throw new Error('Workflow must have a Start node');
      }
      console.log('🚀 Found Start node:', currentNode.id, currentNode.name);
    } else {
      // Get last executed node and find next node via edges
      console.log('🔍 Session results:', {
        resultsCount: session.results.length,
        currentIndex: session.currentNodeIndex,
        results: session.results.map((r: any) => ({ nodeId: r.nodeId, nodeName: r.nodeName })),
      });

      const lastResult = session.results[session.results.length - 1];

      if (!lastResult || !lastResult.nodeId) {
        throw new Error(`Cannot determine last executed node. Results: ${session.results.length}`);
      }

      const lastNodeId = lastResult.nodeId;
      console.log('🔍 Last node ID:', lastNodeId);

      // Find edge from last node
      const edge = workflow.edges.find((e: any) => e.source === lastNodeId);

      // Calculate total nodes (including End node)
      const totalNodes = workflow.nodes.length;

      if (!edge) {
        // No more edges, workflow complete
        session.status = 'completed';
        await session.save();
        return {
          status: 'completed',
          message: 'Workflow finished',
          sessionStatus: 'completed',
          progress: {
            current: session.currentNodeIndex,
            total: totalNodes,
          },
        };
      }

      // Find target node
      currentNode = workflow.nodes.find((n: any) => n.id === edge.target);

      // If target is End node, mark as complete
      if (!currentNode || currentNode.type === 'end') {
        session.status = 'completed';
        await session.save();
        return {
          status: 'completed',
          message: 'Workflow finished',
          sessionStatus: 'completed',
          progress: {
            current: session.currentNodeIndex,
            total: totalNodes,
          },
        };
      }
    }

    // 4. Determine input for this node
    const input = session.currentNodeIndex === 0
      ? session.input
      : session.results[session.results.length - 1]?.output;

    // 5. Check cache
    const cacheKey = this.cacheKeyGenerator.generate(
      session.workflowId,
      currentNode.id,
      input,
    );

    let result;
    let cached = false;
    const cachedResult = await this.executionCache.getCachedNodeResult(
      session.workflowId,
      currentNode.id,
      input,
    );

    if (cachedResult && this.shouldUseCachedResult(currentNode, cachedResult)) {
      result = cachedResult;
      cached = true;
    } else {
      // 6. Execute node
      const startTime = Date.now();
      result = await this.nodeExecutor.execute(currentNode, input);
      result.duration = Date.now() - startTime;

      // 7. Save to cache
      await this.executionCache.setCachedNodeResult(
        session.workflowId,
        currentNode.id,
        input,
        result,
      );

      // Save to MongoDB for persistence
      const nodeResult = new this.nodeResultModel({
        workflowId: session.workflowId,
        nodeId: currentNode.id,
        nodeName: currentNode.name,
        nodeType: currentNode.type,
        input,
        output: result.output,
        config: currentNode.config,
        cost: result.cost,
        duration: result.duration,
        cacheKey,
      });
      await nodeResult.save();
    }

    // 8. Update session state
    console.log('🔍 Pushing result:', {
      nodeId: currentNode.id,
      nodeName: currentNode.name || currentNode.type,
      resultsLength: session.results.length,
    });

    session.results.push({
      nodeId: currentNode.id,
      nodeName: currentNode.name || currentNode.type,
      input,
      output: result.output,
      cost: result.cost || 0,
      duration: result.duration || 0,
      cached,
      executedAt: new Date(),
    });

    session.currentNodeIndex++;
    session.totalCost += result.cost || 0;
    session.totalDuration += result.duration || 0;

    console.log('💾 Saving session:', {
      currentNodeIndex: session.currentNodeIndex,
      resultsLength: session.results.length,
      totalCost: session.totalCost,
    });

    // Mark results array as modified so Mongoose saves it
    session.markModified('results');
    await session.save();

    console.log('✅ Session saved successfully');

    // 9. Calculate total nodes (including End node)
    const totalNodes = workflow.nodes.length;

    // 10. Return result
    return {
      nodeId: currentNode.id,
      nodeName: currentNode.name || currentNode.type,
      nodeType: currentNode.type,
      input,
      output: result.output,
      cost: result.cost,
      duration: result.duration,
      cached,
      sessionStatus: session.status,
      progress: {
        current: session.currentNodeIndex,
        total: totalNodes,
      },
    };
  }

  async continueFromCurrentNode(sessionId: string): Promise<any> {
    let session = await this.executionStateModel.findById(sessionId);
    if (!session) {
      throw new NotFoundException('Debug session not found');
    }

    // Execute nodes until workflow is complete
    while (session.status !== 'completed') {
      const result = await this.executeNextNode(sessionId);

      // If workflow is complete, break
      if (result.status === 'completed' || result.sessionStatus === 'completed') {
        break;
      }

      // Reload session after each step to get updated state
      session = await this.executionStateModel.findById(sessionId);

      if (!session) {
        throw new NotFoundException('Session lost during execution');
      }
    }

    // Get final state
    const finalSession = await this.executionStateModel.findById(sessionId);

    if (!finalSession) {
      throw new NotFoundException('Session not found after completion');
    }

    return {
      status: 'completed',
      results: finalSession.results,
      totalCost: finalSession.totalCost,
      totalDuration: finalSession.totalDuration,
    };
  }

  shouldUseCachedResult(node: any, cachedResult: any): boolean {
    // Invalidate cache if node config changed
    if (!cachedResult.config) {
      return false;
    }

    const configHash = this.hashObject(node.config);
    const cachedConfigHash = this.hashObject(cachedResult.config);

    return configHash === cachedConfigHash;
  }

  private hashObject(obj: any): string {
    const str = JSON.stringify(obj, Object.keys(obj || {}).sort());
    return require('crypto').createHash('sha256').update(str).digest('hex');
  }
}
