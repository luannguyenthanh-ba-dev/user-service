import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

export class RenewVerifyCodeDto {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
