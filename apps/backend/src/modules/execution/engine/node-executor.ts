import { Injectable } from '@nestjs/common';
import { NodeExecutionStrategy, ExecutionResult } from '../strategies/node-execution.strategy';
import { StartNodeStrategy } from '../strategies/start-node.strategy';
import { LLMNodeStrategy } from '../strategies/llm-node.strategy';
import { EndNodeStrategy } from '../strategies/end-node.strategy';
import { ConditionNodeStrategy } from '../strategies/condition-node.strategy';
import { RAGNodeStrategy } from '../strategies/rag-node.strategy';
import { ToolNodeStrategy } from '../strategies/tool-node.strategy';

@Injectable()
export class NodeExecutor {
  private strategies: Map<string, NodeExecutionStrategy>;

  constructor(
    private startNodeStrategy: StartNodeStrategy,
    private llmNodeStrategy: LLMNodeStrategy,
    private endNodeStrategy: EndNodeStrategy,
    private conditionNodeStrategy: ConditionNodeStrategy,
    private ragNodeStrategy: RAGNodeStrategy,
    private toolNodeStrategy: ToolNodeStrategy,
  ) {
    // Register strategies by node type
    this.strategies = new Map([
      ['start', this.startNodeStrategy],
      ['llm', this.llmNodeStrategy],
      ['end', this.endNodeStrategy],
      ['condition', this.conditionNodeStrategy],
      ['rag', this.ragNodeStrategy],
      ['tool', this.toolNodeStrategy],
    ]);
  }

  async execute(node: any, input: any): Promise<ExecutionResult> {
    const strategy = this.strategies.get(node.type);

    if (!strategy) {
      throw new Error(`No strategy found for node type: ${node.type}`);
    }

    return strategy.execute(node, input);
  }
}
