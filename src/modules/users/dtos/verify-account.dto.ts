import { IsDefined, IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

export class VerifyAccountDto {
  @IsNumberString()
  @IsDefined()
  @IsNotEmpty()
  code: string;

  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email: string;
}
