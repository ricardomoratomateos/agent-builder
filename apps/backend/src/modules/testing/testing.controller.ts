import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TestingService } from './testing.service';

@Controller('testing')
export class TestingController {
  constructor(private readonly testingService: TestingService) {}

  @Post('suites')
  createTestSuite(@Body() body: any) {
    return this.testingService.createTestSuite(body);
  }

  @Get('suites')
  getAllTestSuites() {
    return this.testingService.getAllTestSuites();
  }

  @Get('suites/:id')
  getTestSuite(@Param('id') id: string) {
    return this.testingService.getTestSuite(id);
  }

  @Post('suites/:id/run')
  runTestSuite(@Param('id') id: string) {
    return this.testingService.runTestSuite(id);
  }

  @Get('results')
  getAllResults() {
    return this.testingService.getAllResults();
  }

  @Get('results/:id')
  getResult(@Param('id') id: string) {
    return this.testingService.getResult(id);
  }
}
