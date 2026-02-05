import { IsString, IsNotEmpty, IsOptional, IsArray, IsObject } from 'class-validator';

export class CreateTestSuiteDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  agentId: string;

  @IsArray()
  @IsOptional()
  tests?: any[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
