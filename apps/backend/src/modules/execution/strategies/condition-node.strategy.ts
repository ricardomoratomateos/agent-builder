import { Injectable } from '@nestjs/common';
import { NodeExecutionStrategy, ExecutionResult } from './node-execution.strategy';

@Injectable()
export class ConditionNodeStrategy implements NodeExecutionStrategy {
  async execute(node: any, input: any): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // Evaluate condition
      const condition = node.config?.condition || 'true';
      const result = this.evaluateCondition(condition, input);

      return {
        output: {
          conditionMet: result,
          originalInput: input,
          branch: result ? 'true' : 'false',
        },
        cost: 0, // No cost for condition evaluation
        duration: Date.now() - startTime,
      };
    } catch (error) {
      console.error('Condition evaluation error:', error);

      // On error, default to false branch
      return {
        output: {
          conditionMet: false,
          originalInput: input,
          branch: 'false',
          error: error.message,
        },
        cost: 0,
        duration: Date.now() - startTime,
      };
    }
  }

  private evaluateCondition(condition: string, input: any): boolean {
    // Safety check
    if (!condition || condition.trim() === '') {
      return false;
    }

    try {
      // Create a safe evaluation context
      // Note: In production, use a safer parser like mathjs or vm2
      // This is a simplified version for demonstration

      // Create function with input in scope
      const func = new Function('input', `
        try {
          return Boolean(${condition});
        } catch (e) {
          console.error('Condition evaluation error:', e);
          return false;
        }
      `);

      return func(input);
    } catch (error) {
      console.error('Failed to create condition function:', error);
      return false;
    }
  }
}
