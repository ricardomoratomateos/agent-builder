import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OptimizerController } from './optimizer.controller';
import { OptimizerService } from './optimizer.service';
import { ConversationAnalyzer } from './analyzers/conversation-analyzer';
import { CostAnalyzer } from './analyzers/cost-analyzer';
import { PerformanceAnalyzer } from './analyzers/performance-analyzer';
import { ModelDowngradeSuggester } from './suggestions/model-downgrade.suggester';
import { CacheSuggester } from './suggestions/cache-suggester';
import { PromptOptimizationSuggester } from './suggestions/prompt-optimization.suggester';
import { RagTuningSuggester } from './suggestions/rag-tuning.suggester';
import { Optimization, OptimizationSchema } from './schemas/optimization.schema';
import { Suggestion, SuggestionSchema } from './schemas/suggestion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Optimization.name, schema: OptimizationSchema },
      { name: Suggestion.name, schema: SuggestionSchema },
    ]),
  ],
  controllers: [OptimizerController],
  providers: [
    OptimizerService,
    ConversationAnalyzer,
    CostAnalyzer,
    PerformanceAnalyzer,
    ModelDowngradeSuggester,
    CacheSuggester,
    PromptOptimizationSuggester,
    RagTuningSuggester,
  ],
  exports: [OptimizerService],
})
export class OptimizerModule {}
