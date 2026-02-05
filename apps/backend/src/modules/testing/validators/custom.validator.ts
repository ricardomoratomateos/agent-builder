import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomValidator {
  async validate(output: any, validatorFn: string): Promise<boolean> {
    // TODO: Implement custom TypeScript function execution
    // 1. Parse validator function from string
    // 2. Execute in sandboxed environment
    // 3. Return boolean result
    console.log('Custom validator not yet implemented');
    return true;
  }

  // Built-in validators
  contains(output: string, value: string): boolean {
    return output.includes(value);
  }

  notContains(output: string, value: string): boolean {
    return !output.includes(value);
  }

  isJsonParseable(output: string): boolean {
    try {
      JSON.parse(output);
      return true;
    } catch {
      return false;
    }
  }

  matchesRegex(output: string, pattern: string): boolean {
    const regex = new RegExp(pattern);
    return regex.test(output);
  }
}
