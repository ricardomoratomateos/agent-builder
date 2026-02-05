import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NodeDocument = Node & Document;

@Schema({ timestamps: true })
export class Node {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Object })
  config: Record<string, any>;

  @Prop({ type: Object })
  position: { x: number; y: number };

  @Prop({ type: Array, default: [] })
  inputs: string[];

  @Prop({ type: Array, default: [] })
  outputs: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const NodeSchema = SchemaFactory.createForClass(Node);
