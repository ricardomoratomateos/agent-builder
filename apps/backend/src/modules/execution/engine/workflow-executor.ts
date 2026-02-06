import { Injectable } from '@nestjs/common';
import { StateGraph, END } from '@langchain/langgraph';
import { NodeExecutor } from './node-executor';
import { WorkflowsService } from '../../workflows/workflows.service';

interface WorkflowState {
  input: any;
  output: any;
  nodeResults: Map<string, any>;
  totalCost: number;
  totalDuration: number;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
}

@Injectable()
export class WorkflowExecutor {
  constructor(
    private nodeExecutor: NodeExecutor,
    private workflowsService: WorkflowsService,
  ) {}

  async execute(workflowId: string, input: any): Promise<any> {
    // Load workflow
    const workflow = await this.workflowsService.findOne(workflowId);

    // Build LangGraph
    const graph = await this.buildExecutionGraph(workflow);

    // Execute
    const result = await graph.invoke({
      input,
      output: null,
      nodeResults: new Map(),
      totalCost: 0,
      totalDuration: 0,
      totalTokens: 0,
      inputTokens: 0,
      outputTokens: 0,
    });

    return {
      status: 'completed',
      output: result.output,
      cost: result.totalCost,
      duration: result.totalDuration,
      tokenUsage: {
        totalTokens: result.totalTokens,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
      },
      nodeResults: Array.from(result.nodeResults.entries()),
    };
  }

  async buildExecutionGraph(workflow: any) {
    const graph = new StateGraph({
      channels: {
        input: {
          value: (prev: any, next: any) => next ?? prev,
          default: () => null,
        },
        output: {
          value: (prev: any, next: any) => next ?? prev,
          default: () => null,
        },
        nodeResults: {
          value: (prev: Map<string, any>, next: Map<string, any>) => next ?? prev,
          default: () => new Map(),
        },
        totalCost: {
          value: (prev: number, next: number) => next ?? prev,
          default: () => 0,
        },
        totalDuration: {
          value: (prev: number, next: number) => next ?? prev,
          default: () => 0,
        },
        totalTokens: {
          value: (prev: number, next: number) => next ?? prev,
          default: () => 0,
        },
        inputTokens: {
          value: (prev: number, next: number) => next ?? prev,
          default: () => 0,
        },
        outputTokens: {
          value: (prev: number, next: number) => next ?? prev,
          default: () => 0,
        },
      },
    });

    // Add nodes (skip 'end' type nodes - they map to LangGraph's END)
    workflow.nodes.forEach((node: any) => {
      if (node.type === 'end') {
        return; // Skip end nodes - they're handled by LangGraph's END symbol
      }

      graph.addNode(node.id, async (state: WorkflowState) => {
        const result = await this.nodeExecutor.execute(node, state.input);

        state.nodeResults.set(node.id, result);
        state.output = result.output;
        state.totalCost += result.cost || 0;
        state.totalDuration += result.duration || 0;

        if (result.tokenUsage) {
          state.totalTokens += result.tokenUsage.totalTokens || 0;
          state.inputTokens += result.tokenUsage.inputTokens || 0;
          state.outputTokens += result.tokenUsage.outputTokens || 0;
        }

        // Pass output as input for next node
        state.input = result.output;

        return state;
      });
    });

    // Add edges (including conditional edges for ConditionNode)
    workflow.edges.forEach((edge: any) => {
      const sourceNode = workflow.nodes.find((n: any) => n.id === edge.source);
      const targetNode = workflow.nodes.find((n: any) => n.id === edge.target);

      // If target is an 'end' type node, map to LangGraph's END
      const target = targetNode?.type === 'end' ? END : edge.target;

      // Handle conditional edges (for ConditionNode)
      if (sourceNode?.type === 'condition' && edge.sourceHandle) {
        // Conditional edge based on sourceHandle ('true' or 'false')
        graph.addConditionalEdges(
          edge.source,
          (state: WorkflowState) => {
            const result = state.nodeResults.get(edge.source);
            const conditionMet = result?.output?.conditionMet || false;

            // Find the edge that matches this condition
            const targetEdge = workflow.edges.find((e: any) =>
              e.source === edge.source &&
              e.sourceHandle === (conditionMet ? 'true' : 'false')
            );

            if (!targetEdge) return END;

            const targetNode = workflow.nodes.find((n: any) => n.id === targetEdge.target);
            return targetNode?.type === 'end' ? END : targetEdge.target;
          },
        );
      } else {
        // Normal edge
        graph.addEdge(edge.source, target);
      }
    });

    // Find and set entry point (Start node)
    const startNode = workflow.nodes.find((node: any) => node.type === 'start');
    if (!startNode) {
      throw new Error('Workflow must have a Start node');
    }

    graph.setEntryPoint(startNode.id);

    return graph.compile();
  }
}
