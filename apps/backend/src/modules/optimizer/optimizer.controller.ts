import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OptimizerService } from './optimizer.service';

@Controller('optimizer')
export class OptimizerController {
  constructor(private readonly optimizerService: OptimizerService) {}

  @Post('analyze')
  analyzeAgent(@Body() body: { agentId: string; timeRange?: any }) {
    return this.optimizerService.analyzeAgent(body.agentId, body.timeRange);
  }

  @Get('suggestions/:agentId')
  getSuggestions(@Param('agentId') agentId: string) {
    return this.optimizerService.getSuggestions(agentId);
  }

  @Post('suggestions/:id/implement')
  implementSuggestion(@Param('id') id: string) {
    return this.optimizerService.implementSuggestion(id);
  }

  @Post('suggestions/:id/ignore')
  ignoreSuggestion(@Param('id') id: string) {
    return this.optimizerService.ignoreSuggestion(id);
  }

  @Get('savings/:agentId')
  calculateSavings(@Param('agentId') agentId: string) {
    return this.optimizerService.calculateSavings(agentId);
  }
}
