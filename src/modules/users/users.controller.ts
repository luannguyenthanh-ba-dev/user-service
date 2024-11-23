import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ChangeUserStatusDto,
  GetListUsersDto,
  RegisterUserDto,
  RenewVerifyCodeDto,
  UpdateUserDto,
  VerifyAccountDto,
} from './dtos';
import {
  CanManageObjects,
  IUserPayload,
  res,
  ROLES,
  UserStatus,
} from 'src/common/utils';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AnyUser, Auth, User } from '../auth/auth.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Users')
@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Register User',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success!',
    type: Object,
  })
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

  @ApiOperation({
    summary: 'Renew verification code',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success!',
    type: Object,
  })
  @Post('verifications/renews')
  async renewVerifyCode(@Body() data: RenewVerifyCodeDto) {
    const user = await this.usersService.findOne({
      email: data.email,
      status: UserStatus.PENDING,
      isVerified: false,
    });

    if (!user) {
      throw new NotFoundException('ERROR: Not found non-verify user!');
    }

    const verifyCode = await this.usersService.generateVerifyCode({
      userId: user._id,
      email: user.email,
    });

    return res(HttpStatus.CREATED, verifyCode);
  }

  @ApiOperation({
    summary: 'Verify User',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success!',
    type: Object,
  })
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
      throw new NotFoundException('ERROR: Not found non-verify user!');
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

  @ApiOperation({
    summary: 'Get user profile',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success!',
    type: Object,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('profiles')
  async profiles(@User() user) {
    return res(HttpStatus.OK, user);
  }

  @ApiOperation({
    summary: 'Get list users',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success!',
    type: Object,
  })
  @ApiBearerAuth()
  @Auth(ROLES.ADMIN, ROLES.SUPER_ADMIN)
  /**
   * To utilize the class-validator decorators, we need to use the ValidationPipe.
   * Additionally, to utilize the class-transformer decorators, we need to use ValidationPipe with its transform: true flag
   */
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async getListUsers(@Query() filters: GetListUsersDto) {
    const users = await this.usersService.findMany(
      { ...filters, isDeleted: false },
      '-password',
    );
    return res(HttpStatus.OK, users);
  }

  @ApiOperation({
    summary: 'Update user info',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success!',
    type: Object,
  })
  @ApiBearerAuth()
  @AnyUser()
  @UseGuards(AuthGuard)
  @Put('infos/:_id')
  async updateUser(
    @Param('_id') _id: string,
    @Body() data: UpdateUserDto,
    @User() user: IUserPayload,
  ) {
    // Verify project owner
    if (!CanManageObjects(user, { ownerId: _id })) {
      throw new ForbiddenException(
        'ERROR: Not have permission to update this user info!',
      );
    }

    const existUser = await this.usersService.findOne({
      _id,
      isDeleted: false,
    });
    if (!existUser) {
      throw new NotFoundException('ERROR: Not found this user to update info!');
    }

    const updated = await this.usersService.updateOne({ _id }, data);
    return res(HttpStatus.OK, updated);
  }

  @ApiOperation({
    summary: 'Change user status',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success!',
    type: Object,
  })
  @ApiParam({
    name: '_id',
    type: String,
  })
  @ApiBearerAuth()
  @Auth(ROLES.ADMIN, ROLES.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('status/:_id')
  async changeUserStatus(
    @Param('_id') _id: string,
    @Body() data: ChangeUserStatusDto,
  ) {
    const existUser = await this.usersService.findOne({
      _id,
      isDeleted: false,
    });
    if (!existUser) {
      throw new NotFoundException('ERROR: Not found this user to block!');
    }
    if (
      data.status === UserStatus.BLOCKED &&
      existUser.status === UserStatus.BLOCKED
    ) {
      throw new NotImplementedException('ERROR: User was blocked!');
    }
    if (
      data.status === UserStatus.ACTIVE &&
      existUser.status === UserStatus.ACTIVE
    ) {
      throw new NotImplementedException('ERROR: User already activated!');
    }

    const blocked = await this.usersService.updateOne(
      { _id },
      { status: data.status },
    );
    return res(HttpStatus.OK, blocked);
  }

  @ApiOperation({
    summary: 'Delete user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success!',
    type: Object,
  })
  @ApiParam({
    name: '_id',
    type: String,
  })
  @ApiBearerAuth()
  @Auth(ROLES.SUPER_ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':_id')
  async deleteUser(@Param('_id') _id: string) {
    const existUser = await this.usersService.findOne({
      _id,
      isDeleted: false,
    });
    console.log(existUser);
    if (!existUser) {
      throw new NotFoundException('ERROR: Not found this user to delete!');
    }

    const deleted = await this.usersService.deleteOne({ _id });
    return res(HttpStatus.OK, deleted);
  }
}
