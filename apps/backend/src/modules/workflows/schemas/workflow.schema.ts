import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WorkflowDocument = Workflow & Document;

@Schema({ timestamps: true })
export class Workflow {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Array, default: [] })
  nodes: any[];

  @Prop({ type: Array, default: [] })
  edges: any[];

  @Prop({ type: Object })
  config: Record<string, any>;

  @Prop({ default: 'draft' })
  version: string;

  @Prop()
  parentId: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const WorkflowSchema = SchemaFactory.createForClass(Workflow);
