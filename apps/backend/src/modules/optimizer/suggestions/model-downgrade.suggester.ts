import { Injectable } from '@nestjs/common';

@Injectable()
export class ModelDowngradeSuggester {
  async generateSuggestions(conversations: any[]): Promise<any[]> {
    // TODO: Implement model downgrade detection
    // 1. Identify simple conversations using expensive models
    // 2. Test cheaper model on sample conversations
    // 3. Calculate savings (Sonnet → Haiku)
    // 4. Generate suggestion with confidence score
    return [];
  }

  canDowngradeToHaiku(conversation: any): boolean {
    // TODO: Determine if conversation is simple enough for Haiku
    // Factors: turn count, complexity, tool usage, reasoning depth
    return false;
  }

  calculateDowngradeSavings(currentModel: string, targetModel: string, usage: any): number {
    // Pricing per million tokens (as of Feb 2026)
    const pricing = {
      // 🔥 Económicos
      'gpt-5-nano': { input: 0.05, output: 0.40 },
      'gemini-2.0-flash-lite': { input: 0.08, output: 0.30 },
      'gpt-4o-mini': { input: 0.15, output: 0.60 },
      'claude-3-5-haiku-20241022': { input: 1.0, output: 5.0 },

      // ⚡ Balanceado
      'gpt-4o': { input: 2.5, output: 10.0 },
      'claude-sonnet-4-5': { input: 3.0, output: 15.0 },

      // 🚀 Premium
      'claude-opus-4-5': { input: 5.0, output: 25.0 },
      'claude-opus-4-6': { input: 5.0, output: 25.0 },

      // 📦 Legacy
      'claude-3-5-sonnet-20241022': { input: 3.0, output: 15.0 },
      'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
    };

    const currentPricing = pricing[currentModel] || { input: 0, output: 0 };
    const targetPricing = pricing[targetModel] || { input: 0, output: 0 };

    const currentCost = (usage.inputTokens / 1_000_000) * currentPricing.input +
                        (usage.outputTokens / 1_000_000) * currentPricing.output;
    const targetCost = (usage.inputTokens / 1_000_000) * targetPricing.input +
                       (usage.outputTokens / 1_000_000) * targetPricing.output;

    return currentCost - targetCost;
  }
}
