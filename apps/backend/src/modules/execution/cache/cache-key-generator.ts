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
    let str: string;

    // Handle null and undefined
    if (obj === null) {
      str = 'null';
    } else if (obj === undefined) {
      str = 'undefined';
    } else if (typeof obj === 'object') {
      // For objects and arrays, sort keys for consistent hashing
      str = JSON.stringify(obj, Object.keys(obj).sort());
    } else {
      // For primitives (string, number, boolean)
      str = JSON.stringify(obj);
    }

    return crypto.createHash('sha256').update(str).digest('hex');
  }
}
