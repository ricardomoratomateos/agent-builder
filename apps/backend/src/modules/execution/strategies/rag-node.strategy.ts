import { Injectable } from '@nestjs/common';
import { NodeExecutionStrategy, ExecutionResult } from './node-execution.strategy';

@Injectable()
export class RAGNodeStrategy implements NodeExecutionStrategy {
  async execute(node: any, input: any): Promise<ExecutionResult> {
    const startTime = Date.now();

    // TODO: Implement RAG with Qdrant
    // For now, just pass through the input
    // This will be implemented in Phase 3 when we add Qdrant integration

    const { collection, topK, scoreThreshold } = node.config;

    // Placeholder implementation
    const output = {
      query: typeof input === 'string' ? input : input.message || JSON.stringify(input),
      results: [],
      message: `RAG search not yet implemented. Would search collection "${collection}" with topK=${topK}`,
    };

    return {
      output,
      cost: 0, // No cost for RAG node (yet)
      duration: Date.now() - startTime,
      tokenUsage: {
        totalTokens: 0,
        inputTokens: 0,
        outputTokens: 0,
      },
    };
  }
}
