import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExecutionStateDocument = ExecutionState & Document;

@Schema({ timestamps: true })
export class ExecutionState {
  @Prop({ required: true })
  workflowId: string;

  @Prop({ type: Object })
  input: any;

  @Prop({ default: 0 })
  currentNodeIndex: number;

  @Prop({ required: true })
  mode: string; // 'production', 'debug'

  @Prop({ required: true })
  status: string; // 'running', 'paused', 'completed', 'failed'

  @Prop({ type: Array, default: [] })
  results: Array<{
    nodeId: string;
    nodeName: string;
    input: any;
    output: any;
    cost: number;
    duration: number;
    cached: boolean;
    executedAt: Date;
  }>;

  @Prop({ default: 0 })
  totalCost: number;

  @Prop({ default: 0 })
  totalDuration: number;

  @Prop()
  error?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ExecutionStateSchema = SchemaFactory.createForClass(ExecutionState);
