import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExecutionState, ExecutionStateDocument } from './schemas/execution-state.schema';
import { NodeResult, NodeResultDocument } from './schemas/node-result.schema';
import { WorkflowExecutor } from './engine/workflow-executor';
import { DebugExecutor } from './engine/debug-executor';
import { ExecutionCacheService } from './cache/execution-cache.service';

@Injectable()
export class ExecutionService {
  constructor(
    @InjectModel(ExecutionState.name) private executionStateModel: Model<ExecutionStateDocument>,
    @InjectModel(NodeResult.name) private nodeResultModel: Model<NodeResultDocument>,
    private workflowExecutor: WorkflowExecutor,
    private debugExecutor: DebugExecutor,
    private executionCache: ExecutionCacheService,
  ) {}

  async executeWorkflow(workflowId: string, input: any): Promise<any> {
    // TODO: Execute workflow in production mode (all nodes at once)
    return this.workflowExecutor.execute(workflowId, input);
  }

  async startDebugSession(workflowId: string, input: any): Promise<ExecutionState> {
    // TODO: Initialize debug session
    const session = new this.executionStateModel({
      workflowId,
      input,
      currentNodeIndex: 0,
      mode: 'debug',
      status: 'running',
      results: [],
    });
    return session.save();
  }

  async executeNextStep(sessionId: string): Promise<NodeResult> {
    // TODO: Execute next node in debug mode
    // 1. Load session state
    // 2. Get next node
    // 3. Check cache
    // 4. Execute if not cached
    // 5. Save result
    // 6. Update session state
    return this.debugExecutor.executeNextNode(sessionId);
  }

  async getDebugState(sessionId: string): Promise<ExecutionState> {
    return this.executionStateModel.findById(sessionId).exec();
  }

  async continueExecution(sessionId: string): Promise<any> {
    // TODO: Execute remaining nodes without stopping
    return this.debugExecutor.continueFromCurrentNode(sessionId);
  }

  async getExecutionResults(executionId: string): Promise<ExecutionState> {
    return this.executionStateModel.findById(executionId).exec();
  }

  async getCachedResults(workflowId: string): Promise<NodeResult[]> {
    return this.nodeResultModel.find({ workflowId }).exec();
  }

  async clearCache(workflowId: string): Promise<void> {
    await this.executionCache.clearWorkflowCache(workflowId);
    await this.nodeResultModel.deleteMany({ workflowId }).exec();
  }
}
