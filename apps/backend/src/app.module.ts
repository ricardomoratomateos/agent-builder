import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgentsModule } from './modules/agents/agents.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { NodesModule } from './modules/nodes/nodes.module';
import { CacheService } from './modules/cache/cache.module';
import { VectorModule } from './modules/vector/vector.module';
import { TestingModule } from './modules/testing/testing.module';
import { OptimizerModule } from './modules/optimizer/optimizer.module';
import { ExecutionModule } from './modules/execution/execution.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MongoDB
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/agent-builder'),

    // Redis Cache
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      ttl: 300, // 5 minutes default TTL
    }),

    // Feature modules
    AgentsModule,
    WorkflowsModule,
    NodesModule,
    CacheService,
    VectorModule,
    TestingModule,
    OptimizerModule,
    ExecutionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
