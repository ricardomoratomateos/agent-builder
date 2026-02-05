import { Injectable } from '@nestjs/common';
import { CacheKeyGenerator } from './cache-key-generator';

@Injectable()
export class ExecutionCacheService {
  private cache: Map<string, any> = new Map();

  constructor(private cacheKeyGenerator: CacheKeyGenerator) {}

  async getCachedNodeResult(workflowId: string, nodeId: string, input: any): Promise<any> {
    const cacheKey = this.cacheKeyGenerator.generate(workflowId, nodeId, input);
    return this.cache.get(cacheKey);
  }

  async setCachedNodeResult(
    workflowId: string,
    nodeId: string,
    input: any,
    result: any,
  ): Promise<void> {
    const cacheKey = this.cacheKeyGenerator.generate(workflowId, nodeId, input);
    this.cache.set(cacheKey, result);
  }

  async clearWorkflowCache(workflowId: string): Promise<void> {
    // TODO: Clear all cached results for a workflow
    const keysToDelete: string[] = [];
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${workflowId}:`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  async clearNodeCache(workflowId: string, nodeId: string): Promise<void> {
    // TODO: Clear cached results for a specific node
    const keysToDelete: string[] = [];
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${workflowId}:${nodeId}:`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach((key) => this.cache.delete(key));
  }
}
