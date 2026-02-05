import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TestSuite, TestSuiteDocument } from './schemas/test-suite.schema';
import { TestResult, TestResultDocument } from './schemas/test-result.schema';
import { LlmJudgeValidator } from './validators/llm-judge.validator';
import { CustomValidator } from './validators/custom.validator';

@Injectable()
export class TestingService {
  constructor(
    @InjectModel(TestSuite.name) private testSuiteModel: Model<TestSuiteDocument>,
    @InjectModel(TestResult.name) private testResultModel: Model<TestResultDocument>,
    private llmJudgeValidator: LlmJudgeValidator,
    private customValidator: CustomValidator,
  ) {}

  async createTestSuite(data: any): Promise<TestSuite> {
    const testSuite = new this.testSuiteModel(data);
    return testSuite.save();
  }

  async getAllTestSuites(): Promise<TestSuite[]> {
    return this.testSuiteModel.find().exec();
  }

  async getTestSuite(id: string): Promise<TestSuite> {
    return this.testSuiteModel.findById(id).exec();
  }

  async runTestSuite(id: string): Promise<TestResult> {
    // TODO: Implement test execution logic
    // 1. Load test suite
    // 2. Execute tests
    // 3. Run validators (LLM-judge, custom)
    // 4. Calculate costs
    // 5. Save results
    const result = new this.testResultModel({
      testSuiteId: id,
      status: 'pending',
      results: [],
      totalCost: 0,
      executedAt: new Date(),
    });
    return result.save();
  }

  async getAllResults(): Promise<TestResult[]> {
    return this.testResultModel.find().exec();
  }

  async getResult(id: string): Promise<TestResult> {
    return this.testResultModel.findById(id).exec();
  }
}
