import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TestSuiteDocument = TestSuite & Document;

@Schema({ timestamps: true })
export class TestSuite {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  agentId: string;

  @Prop({ type: Array, default: [] })
  tests: Array<{
    name: string;
    input: any;
    expectedOutput?: any;
    assertions: Array<{
      type: string; // 'contains', 'not-contains', 'llm-judge', 'custom'
      value: any;
      customValidator?: string; // TypeScript function as string
    }>;
  }>;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TestSuiteSchema = SchemaFactory.createForClass(TestSuite);
