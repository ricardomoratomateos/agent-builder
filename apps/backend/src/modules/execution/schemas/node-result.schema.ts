import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NodeResultDocument = NodeResult & Document;

@Schema({ timestamps: true })
export class NodeResult {
  @Prop({ required: true })
  workflowId: string;

  @Prop({ required: true })
  nodeId: string;

  @Prop({ required: true })
  nodeName: string;

  @Prop({ required: true })
  nodeType: string;

  @Prop({ type: Object })
  input: any;

  @Prop({ type: Object })
  output: any;

  @Prop({ type: Object })
  config: any;

  @Prop({ default: 0 })
  cost: number;

  @Prop({ default: 0 })
  duration: number;

  @Prop()
  cacheKey: string;

  @Prop({ default: Date.now })
  executedAt: Date;
}

export const NodeResultSchema = SchemaFactory.createForClass(NodeResult);
