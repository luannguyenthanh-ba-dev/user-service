import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

export class RenewVerifyCodeDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
