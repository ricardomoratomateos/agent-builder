import { IsString, IsNotEmpty, IsOptional, IsArray, IsObject } from 'class-validator';

export class CreateWorkflowDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  nodes?: any[];

  @IsArray()
  @IsOptional()
  edges?: any[];

  @IsObject()
  @IsOptional()
  config?: Record<string, any>;

  @IsString()
  @IsOptional()
  version?: string;
}
