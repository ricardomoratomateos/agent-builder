import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConversationDocument = Conversation & Document;

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface CostTracking {
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  totalCost: number; // USD
  costPerMessage: number[];
}

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Agent' })
  agentId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: Array, default: [] })
  messages: Message[];

  @Prop({
    type: Object,
    default: {
      totalTokens: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalCost: 0,
      costPerMessage: [],
    },
  })
  costTracking: CostTracking;

  @Prop({ default: 'active' })
  status: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
