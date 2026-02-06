import { Injectable } from '@nestjs/common';
import { NodeExecutionStrategy, ExecutionResult } from './node-execution.strategy';

@Injectable()
export class EndNodeStrategy implements NodeExecutionStrategy {
  async execute(node: any, input: any): Promise<ExecutionResult> {
    // End node just passes through the input as output
    return {
      output: input,
      cost: 0,
      duration: 0,
    };
  }
}
