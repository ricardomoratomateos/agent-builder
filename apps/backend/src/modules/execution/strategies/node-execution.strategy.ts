export interface ExecutionResult {
  output: any;
  cost: number;
  duration: number;
  tokenUsage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
}

export interface NodeExecutionStrategy {
  execute(node: any, input: any): Promise<ExecutionResult>;
}
