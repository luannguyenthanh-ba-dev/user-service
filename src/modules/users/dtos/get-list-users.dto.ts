import {
  IsBoolean,
  IsBooleanString,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Gender } from '../users.const';
import { ROLES, UserStatus } from 'src/common/utils';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetListUsersDto {
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
  email?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('VN')
  phone?: string;

  @ApiProperty({
    type: Number,
    required: false,
    enum: Gender,
    default: Gender.UNKNOWN,
  })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @ApiProperty({
    type: String,
    required: false,
    enum: UserStatus,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiProperty({
    type: String,
    required: false,
    enum: ROLES,
  })
  @IsOptional()
  @IsEnum(ROLES)
  role?: ROLES;
}
