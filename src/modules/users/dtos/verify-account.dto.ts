import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  Length,
} from 'class-validator';

export class VerifyAccountDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNumberString()
  @IsDefined()
  @IsNotEmpty()
  @Length(6)
  code: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email: string;
}
