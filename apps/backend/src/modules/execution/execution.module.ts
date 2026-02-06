import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExecutionController } from './execution.controller';
import { ExecutionService } from './execution.service';
import { WorkflowExecutor } from './engine/workflow-executor';
import { NodeExecutor } from './engine/node-executor';
import { DebugExecutor } from './engine/debug-executor';
import { ExecutionCacheService } from './cache/execution-cache.service';
import { CacheKeyGenerator } from './cache/cache-key-generator';
import { ExecutionState, ExecutionStateSchema } from './schemas/execution-state.schema';
import { NodeResult, NodeResultSchema } from './schemas/node-result.schema';
import { StartNodeStrategy } from './strategies/start-node.strategy';
import { LLMNodeStrategy } from './strategies/llm-node.strategy';
import { EndNodeStrategy } from './strategies/end-node.strategy';
import { ConditionNodeStrategy } from './strategies/condition-node.strategy';
import { RAGNodeStrategy } from './strategies/rag-node.strategy';
import { ToolNodeStrategy } from './strategies/tool-node.strategy';
import { WorkflowsModule } from '../workflows/workflows.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExecutionState.name, schema: ExecutionStateSchema },
      { name: NodeResult.name, schema: NodeResultSchema },
    ]),
    WorkflowsModule,
  ],
  controllers: [ExecutionController],
  providers: [
    ExecutionService,
    WorkflowExecutor,
    NodeExecutor,
    DebugExecutor,
    ExecutionCacheService,
    CacheKeyGenerator,
    // Register all strategies
    StartNodeStrategy,
    LLMNodeStrategy,
    EndNodeStrategy,
    ConditionNodeStrategy,
    RAGNodeStrategy,
    ToolNodeStrategy,
  ],
  exports: [ExecutionService],
})
export class ExecutionModule {}
