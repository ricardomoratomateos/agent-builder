import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SuggestionDocument = Suggestion & Document;

@Schema({ timestamps: true })
export class Suggestion {
  @Prop({ required: true })
  agentId: string;

  @Prop({ required: true })
  type: string; // 'model-downgrade', 'cache', 'prompt-optimization', 'rag-tuning'

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 0 })
  estimatedSavings: number;

  @Prop({ type: Object })
  config: Record<string, any>; // Configuration changes to apply

  @Prop({ default: 'pending' })
  status: string; // 'pending', 'implemented', 'ignored'

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  implementedAt?: Date;
}

export const SuggestionSchema = SchemaFactory.createForClass(Suggestion);
