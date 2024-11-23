import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from 'src/common/utils';

enum ValidateStats {
  ACTIVE = UserStatus.ACTIVE,
  BLOCKED = UserStatus.BLOCKED,
}
export class ChangeUserStatusDto {
  @ApiProperty({
    type: String,
    required:true,
    enum: ValidateStats,
  })
  @IsEnum(ValidateStats)
  @IsDefined()
  @IsNotEmpty()
  status: UserStatus;
}
