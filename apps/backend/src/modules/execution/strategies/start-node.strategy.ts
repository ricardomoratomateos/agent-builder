import { Injectable } from '@nestjs/common';
import { NodeExecutionStrategy, ExecutionResult } from './node-execution.strategy';

@Injectable()
export class StartNodeStrategy implements NodeExecutionStrategy {
  async execute(node: any, input: any): Promise<ExecutionResult> {
    const startTime = Date.now();

    // Start node simply passes through the input
    // It marks the beginning of the workflow
    return {
      output: input,
      cost: 0, // No cost for start node
      duration: Date.now() - startTime,
      tokenUsage: {
        totalTokens: 0,
        inputTokens: 0,
        outputTokens: 0,
      },
    };
  }
}
