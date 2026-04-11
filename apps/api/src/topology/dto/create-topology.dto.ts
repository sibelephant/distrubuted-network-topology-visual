import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateTopologyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  data?: any;

  @IsString()
  @IsNotEmpty()
  ownerId: string;
}
