import { IsString, IsNotEmpty, IsOptional, IsObject, IsArray } from 'class-validator';

export class CreateNodeDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  config?: Record<string, any>;

  @IsObject()
  @IsOptional()
  position?: { x: number; y: number };

  @IsArray()
  @IsOptional()
  inputs?: string[];

  @IsArray()
  @IsOptional()
  outputs?: string[];
}
