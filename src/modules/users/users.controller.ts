import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto, RenewVerifyCodeDto, VerifyAccountDto } from './dtos';
import { res, UserStatus } from 'src/common/utils';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../auth/auth.decorator';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('registrations')
  async register(@Body() data: RegisterUserDto) {
    const existedEmail = await this.usersService.findOne({ email: data.email });
    if (existedEmail) {
      throw new NotAcceptableException(
        'ERROR: Your request email already existed in FandB!',
      );
    }
    // Create new user
    const newUser = await this.usersService.create(data);

    const verifyCode = await this.usersService.generateVerifyCode({
      userId: newUser._id,
      email: newUser.email,
    });

    // TODO:
    // Process Sending Verify Email
    //

    return res(HttpStatus.CREATED, verifyCode);
  }

  @Post('verifications/renews')
  async renewVerifyCode(@Body() data: RenewVerifyCodeDto) {
    const user = await this.usersService.findOne({
      email: data.email,
      status: UserStatus.PENDING,
      isVerified: false,
    });

    if (!user) {
      throw new NotFoundException('ERROR: Not found unverify user!');
    }

    const verifyCode = await this.usersService.generateVerifyCode({
      userId: user._id,
      email: user.email,
    });

    return res(HttpStatus.CREATED, verifyCode);
  }

  @Post('verifications')
  async verify(@Body() data: VerifyAccountDto) {
    const [user, verifyCode] = await Promise.all([
      this.usersService.findOne({
        email: data.email,
        status: UserStatus.PENDING,
        isVerified: false,
      }),
      this.usersService.findOneVerify({
        email: data.email,
        verifyCode: data.code,
      }),
    ]);

    if (!user) {
      throw new NotFoundException('ERROR: Not found unverify user!');
    }

    if (!verifyCode) {
      throw new NotFoundException(
        'ERROR: Invalid verify code - or - expired verify code!',
      );
    }

    const verified = await this.usersService.updateOne(
      { email: data.email },
      { status: UserStatus.ACTIVE, isVerified: true },
    );

    if (!verified) {
      throw new NotImplementedException('ERROR: Can not verify this user!');
    }

    return res(HttpStatus.CREATED, { status: 'Success' });
  }

  @UseGuards(AuthGuard)
  @Get('profiles')
  async profiles(@User() user) {
    return res(HttpStatus.OK, user);
  }

  @UseGuards(AuthGuard)
  @Put(':_id')
  async updateUser(
    @Param('_id') _id: string,
    @Body() data: RegisterUserDto,
    @Req() req: any,
  ) {
    return res(HttpStatus.CREATED, {});
  }
}
