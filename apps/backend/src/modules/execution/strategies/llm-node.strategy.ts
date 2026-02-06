import { Injectable } from '@nestjs/common';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOpenAI } from '@langchain/openai';
import { NodeExecutionStrategy, ExecutionResult } from './node-execution.strategy';

@Injectable()
export class LLMNodeStrategy implements NodeExecutionStrategy {
  async execute(node: any, input: any): Promise<ExecutionResult> {
    const startTime = Date.now();

    // Initialize LLM
    const model = this.initializeModel(node.config.model, node.config);

    // Build prompt
    const prompt = this.buildPrompt(node.config, input);

    // Invoke
    const response = await model.invoke(prompt);

    // Extract token usage from response metadata
    const tokenUsageData = response.response_metadata?.tokenUsage;
    const usageData = response.response_metadata?.usage;
    const usageMetadata = (response as any).usage_metadata;

    let inputTokens = 0;
    let outputTokens = 0;
    let totalTokens = 0;

    if (tokenUsageData) {
      // OpenAI format (camelCase)
      inputTokens = tokenUsageData.promptTokens || 0;
      outputTokens = tokenUsageData.completionTokens || 0;
      totalTokens = tokenUsageData.totalTokens || (inputTokens + outputTokens);
    } else if (usageData) {
      // Anthropic format (snake_case)
      inputTokens = usageData.input_tokens || 0;
      outputTokens = usageData.output_tokens || 0;
      totalTokens = usageData.total_tokens || (inputTokens + outputTokens);
    } else if (usageMetadata) {
      // Newer LangChain format
      inputTokens = usageMetadata.input_tokens || 0;
      outputTokens = usageMetadata.output_tokens || 0;
      totalTokens = usageMetadata.total_tokens || (inputTokens + outputTokens);
    }

    const cost = this.calculateCost(node.config.model, inputTokens, outputTokens);

    return {
      output: response.content,
      cost,
      duration: Date.now() - startTime,
      tokenUsage: {
        inputTokens,
        outputTokens,
        totalTokens,
      },
    };
  }

  private initializeModel(modelName: string, config: any) {
    // Los SDKs leen las API keys automáticamente de las variables de entorno:
    // - ChatAnthropic lee ANTHROPIC_API_KEY
    // - ChatOpenAI lee OPENAI_API_KEY
    if (modelName.startsWith('claude')) {
      return new ChatAnthropic({
        model: modelName,
        temperature: config.temperature || 1.0,
        maxTokens: config.maxTokens || 4096,
      });
    } else if (modelName.startsWith('gpt')) {
      return new ChatOpenAI({
        modelName: modelName,
        temperature: config.temperature || 1.0,
        maxTokens: config.maxTokens || 4096,
      });
    }
    throw new Error(`Unsupported model: ${modelName}`);
  }

  private buildPrompt(config: any, input: any): string {
    let prompt = config.prompt || config.userPrompt || '';

    // Replace {input} placeholder with actual input
    const inputText = typeof input === 'string' ? input : input.message || JSON.stringify(input);
    prompt = prompt.replace(/\{input\}/g, inputText);

    // Add system prompt if present
    if (config.systemPrompt) {
      prompt = `System: ${config.systemPrompt}\n\nUser: ${prompt}`;
    }

    return prompt;
  }

  private calculateCost(model: string, inputTokens: number, outputTokens: number): number {
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

    const modelPricing = pricing[model] || { input: 0, output: 0 };

    return (
      (inputTokens / 1_000_000) * modelPricing.input +
      (outputTokens / 1_000_000) * modelPricing.output
    );
  }
}
