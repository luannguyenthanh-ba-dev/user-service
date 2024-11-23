import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Gender } from '../users.const';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('VN')
  phone?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  birthday?: string;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty({
    type: Object,
    required: false,
    example: {
      bust: 90,
      waist: 60,
      hips: 90,
    },
  })
  @IsOptional()
  @IsObject()
  threeRounds?: {
    bust?: number;
    waist?: number;
    hips?: number;
  };

  @ApiProperty({
    type: Number,
    required: false,
    enum: Gender,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  major?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  gallery?: string[];
}
