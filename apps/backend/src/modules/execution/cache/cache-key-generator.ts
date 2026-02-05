import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CacheKeyGenerator {
  generate(workflowId: string, nodeId: string, input: any): string {
    // Generate cache key based on workflow, node, and input
    const inputHash = this.hashObject(input);
    return `${workflowId}:${nodeId}:${inputHash}`;
  }

  private hashObject(obj: any): string {
    const str = JSON.stringify(obj, Object.keys(obj).sort());
    return crypto.createHash('sha256').update(str).digest('hex');
  }
}
