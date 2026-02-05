import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OptimizationDocument = Optimization & Document;

@Schema({ timestamps: true })
export class Optimization {
  @Prop({ required: true })
  agentId: string;

  @Prop({ type: Array, default: [] })
  patterns: Array<{
    type: string; // 'repeated-queries', 'simple-conversations', 'inefficient-rag'
    description: string;
    frequency: number;
    impact: string; // 'high', 'medium', 'low'
  }>;

  @Prop({ type: Array, default: [] })
  suggestions: string[]; // Array of suggestion IDs

  @Prop({ default: 0 })
  potentialSavings: number;

  @Prop({ default: 0 })
  currentMonthlyCost: number;

  @Prop({ default: Date.now })
  analyzedAt: Date;
}

export const OptimizationSchema = SchemaFactory.createForClass(Optimization);
