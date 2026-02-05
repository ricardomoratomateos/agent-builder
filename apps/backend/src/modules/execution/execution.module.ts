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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExecutionState.name, schema: ExecutionStateSchema },
      { name: NodeResult.name, schema: NodeResultSchema },
    ]),
  ],
  controllers: [ExecutionController],
  providers: [
    ExecutionService,
    WorkflowExecutor,
    NodeExecutor,
    DebugExecutor,
    ExecutionCacheService,
    CacheKeyGenerator,
  ],
  exports: [ExecutionService],
})
export class ExecutionModule {}
