import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AgentDocument = Agent & Document;

@Schema({ timestamps: true })
export class Agent {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Object })
  config: Record<string, any>;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop({ default: 'draft' })
  status: string;

  @Prop()
  workflowId: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
