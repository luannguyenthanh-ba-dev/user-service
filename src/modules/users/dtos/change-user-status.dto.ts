import { IsDefined, IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from 'src/common/utils';

enum ValidateStats {
  ACTIVE = UserStatus.ACTIVE,
  BLOCKED = UserStatus.BLOCKED,
}
export class ChangeUserStatusDto {
  @IsEnum(ValidateStats)
  @IsDefined()
  @IsNotEmpty()
  status: UserStatus;
}
