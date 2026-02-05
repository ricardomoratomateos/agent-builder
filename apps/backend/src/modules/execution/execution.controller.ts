import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ExecutionService } from './execution.service';

@Controller('execution')
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Post('run')
  executeWorkflow(@Body() body: { workflowId: string; input: any }) {
    return this.executionService.executeWorkflow(body.workflowId, body.input);
  }

  @Post('debug/start')
  startDebugSession(@Body() body: { workflowId: string; input: any }) {
    return this.executionService.startDebugSession(body.workflowId, body.input);
  }

  @Post('debug/:sessionId/step')
  executeNextStep(@Param('sessionId') sessionId: string) {
    return this.executionService.executeNextStep(sessionId);
  }

  @Get('debug/:sessionId/state')
  getDebugState(@Param('sessionId') sessionId: string) {
    return this.executionService.getDebugState(sessionId);
  }

  @Post('debug/:sessionId/continue')
  continueExecution(@Param('sessionId') sessionId: string) {
    return this.executionService.continueExecution(sessionId);
  }

  @Get('results/:executionId')
  getExecutionResults(@Param('executionId') executionId: string) {
    return this.executionService.getExecutionResults(executionId);
  }

  @Get('cache/:workflowId')
  getCachedResults(@Param('workflowId') workflowId: string) {
    return this.executionService.getCachedResults(workflowId);
  }

  @Post('cache/clear')
  clearCache(@Body() body: { workflowId: string }) {
    return this.executionService.clearCache(body.workflowId);
  }
}
