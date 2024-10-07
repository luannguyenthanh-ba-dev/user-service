import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { User } from './auth.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos';
import { UsersService } from '../users/users.service';
import { comparePassword, res, UserStatus } from 'src/common/utils';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Authz')
@Controller('v1/authz')
export class AuthController {
  private logger = new Logger();
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() data: LoginDto) {
    const user = await this.usersService.findOne({
      email: data.email,
      isVerified: true,
      status: UserStatus.ACTIVE,
      isDeleted: false,
    });
    this.logger.log(`User Info: ${JSON.stringify(user || {})}`);
    if (!user) {
      throw new UnauthorizedException('ERROR: Invalid user!');
    }

    const validatePass = await comparePassword(data.password, user);
    if (!validatePass) {
      throw new UnauthorizedException('ERROR: Invalid password!');
    }

    // Generate JWT for user
    const access_token = this.authService.login(user);

    return res(HttpStatus.CREATED, { access_token });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('introspections')
  async introspections(@User() user) {
    return user;
  }
}
