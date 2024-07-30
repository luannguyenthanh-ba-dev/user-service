import {
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

export class UpdateUserDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  birthday?: string;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsOptional()
  @IsObject()
  threeRounds?: {
    bust?: number;
    waist?: number;
    hips?: number;
  };

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsNumber()
  @IsOptional()
  major?: string;
}
