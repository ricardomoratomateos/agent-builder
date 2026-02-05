import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingController } from './testing.controller';
import { TestingService } from './testing.service';
import { LlmJudgeValidator } from './validators/llm-judge.validator';
import { CustomValidator } from './validators/custom.validator';
import { TestSuite, TestSuiteSchema } from './schemas/test-suite.schema';
import { TestResult, TestResultSchema } from './schemas/test-result.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TestSuite.name, schema: TestSuiteSchema },
      { name: TestResult.name, schema: TestResultSchema },
    ]),
  ],
  controllers: [TestingController],
  providers: [TestingService, LlmJudgeValidator, CustomValidator],
  exports: [TestingService],
})
export class TestingModule {}
