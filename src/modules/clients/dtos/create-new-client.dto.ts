import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AIExperienceLevel } from '../clients.const';

export class CreateNewClientDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty({
    type: String,
    enum: AIExperienceLevel,
    required: false,
  })
  @IsOptional()
  @IsEnum(AIExperienceLevel)
  aiExperienceLevel?: AIExperienceLevel;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  national?: string;
}
