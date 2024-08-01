import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  Length,
} from 'class-validator';

export class VerifyAccountDto {
  @IsNumberString()
  @IsDefined()
  @IsNotEmpty()
  @Length(6)
  code: string;

  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email: string;
}
