import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { AIExperienceLevel } from '../clients.const';
import { Transform } from 'class-transformer';
import { Order } from 'src/common/utils';

export class GetListClientsDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email: string;

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
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiProperty({
    type: Order,
  })
  @IsOptional()
  order?: Order;
}
