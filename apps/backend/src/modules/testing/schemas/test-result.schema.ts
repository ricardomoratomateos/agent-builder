import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TestResultDocument = TestResult & Document;

@Schema({ timestamps: true })
export class TestResult {
  @Prop({ required: true })
  testSuiteId: string;

  @Prop({ required: true })
  status: string; // 'passed', 'failed', 'pending'

  @Prop({ type: Array, default: [] })
  results: Array<{
    testName: string;
    status: string;
    actualOutput: any;
    assertionResults: Array<{
      type: string;
      passed: boolean;
      message: string;
    }>;
    cost: number;
    duration: number;
  }>;

  @Prop({ default: 0 })
  totalCost: number;

  @Prop({ default: 0 })
  totalDuration: number;

  @Prop({ default: Date.now })
  executedAt: Date;
}

export const TestResultSchema = SchemaFactory.createForClass(TestResult);
