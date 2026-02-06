import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, ConversationDocument, Message } from './schemas/conversation.schema';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
  ) {}

  async create(userId: string, agentId: string): Promise<ConversationDocument> {
    const conversation = new this.conversationModel({
      userId: new Types.ObjectId(userId),
      agentId: new Types.ObjectId(agentId),
      messages: [],
      costTracking: {
        totalTokens: 0,
        inputTokens: 0,
        outputTokens: 0,
        totalCost: 0,
        costPerMessage: [],
      },
      status: 'active',
    });

    return conversation.save();
  }

  async findAll(userId: string): Promise<ConversationDocument[]> {
    return this.conversationModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('agentId')
      .sort({ updatedAt: -1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<ConversationDocument> {
    const conversation = await this.conversationModel
      .findById(id)
      .populate('agentId')
      .exec();

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Verify ownership
    if (conversation.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return conversation;
  }

  async addMessage(
    conversationId: string,
    content: string,
    role: 'user' | 'assistant' | 'system',
  ): Promise<ConversationDocument> {
    const message: Message = {
      role,
      content,
      timestamp: new Date(),
    };

    const conversation = await this.conversationModel.findByIdAndUpdate(
      conversationId,
      { $push: { messages: message } },
      { new: true },
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async updateCostTracking(
    conversationId: string,
    costData: {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
      cost: number;
    },
  ): Promise<ConversationDocument> {
    const conversation = await this.conversationModel.findById(conversationId);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    conversation.costTracking.inputTokens += costData.inputTokens;
    conversation.costTracking.outputTokens += costData.outputTokens;
    conversation.costTracking.totalTokens += costData.totalTokens;
    conversation.costTracking.totalCost += costData.cost;
    conversation.costTracking.costPerMessage.push(costData.cost);

    return conversation.save();
  }

  async delete(id: string, userId: string): Promise<void> {
    const conversation = await this.conversationModel.findById(id);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Verify ownership
    if (conversation.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.conversationModel.findByIdAndDelete(id);
  }
}
