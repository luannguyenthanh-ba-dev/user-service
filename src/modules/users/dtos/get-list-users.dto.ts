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

export class GetListUsersDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  phone?: string;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsEnum(ROLES)
  role?: ROLES;
}
