import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExecutionService } from '../execution/execution.service';
import { AgentsService } from '../agents/agents.service';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly executionService: ExecutionService,
    private readonly agentsService: AgentsService,
  ) {}

  @Post()
  async create(@Request() req, @Body() createConversationDto: CreateConversationDto) {
    return this.conversationsService.create(
      req.user.id,
      createConversationDto.agentId,
    );
  }

  @Get()
  async findAll(@Request() req) {
    return this.conversationsService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.conversationsService.findOne(id, req.user.id);
  }

  @Post(':id/messages')
  async sendMessage(
    @Request() req,
    @Param('id') id: string,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    // Get conversation to find agent and workflow
    const conversation = await this.conversationsService.findOne(id, req.user.id);
    const agent = await this.agentsService.findOne(conversation.agentId.toString());

    // Add user message
    await this.conversationsService.addMessage(
      id,
      sendMessageDto.message,
      'user',
    );

    // Execute workflow
    const result = await this.executionService.executeWorkflow(
      agent.workflowId.toString(),
      sendMessageDto.message,
    );

    // Add assistant message
    await this.conversationsService.addMessage(id, result.output, 'assistant');

    // Update cost tracking
    await this.conversationsService.updateCostTracking(id, {
      inputTokens: result.tokenUsage?.inputTokens || 0,
      outputTokens: result.tokenUsage?.outputTokens || 0,
      totalTokens: result.tokenUsage?.totalTokens || 0,
      cost: result.cost || 0,
    });

    return this.conversationsService.findOne(id, req.user.id);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    await this.conversationsService.delete(id, req.user.id);
    return { message: 'Conversation deleted successfully' };
  }
}
