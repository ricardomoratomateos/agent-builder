import { Injectable } from '@nestjs/common';
import { NodeExecutionStrategy, ExecutionResult } from './node-execution.strategy';

@Injectable()
export class ToolNodeStrategy implements NodeExecutionStrategy {
  async execute(node: any, input: any): Promise<ExecutionResult> {
    const startTime = Date.now();

    // TODO: Implement tool calling
    // This will be implemented in Phase 4

    const { toolName, parameters } = node.config;

    // Placeholder implementation
    const output = {
      toolName,
      parameters,
      input,
      message: `Tool execution not yet implemented. Would call tool "${toolName}"`,
    };

    return {
      output,
      cost: 0,
      duration: Date.now() - startTime,
      tokenUsage: {
        totalTokens: 0,
        inputTokens: 0,
        outputTokens: 0,
      },
    };
  }
}
