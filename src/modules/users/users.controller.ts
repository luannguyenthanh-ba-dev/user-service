import {
  Body,
  Controller,
  HttpStatus,
  NotAcceptableException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto, VerifyAccountDto } from './dtos';
import { res } from 'src/common/utils';

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
    const newUser = await this.usersService.create(data);
    // TODO:
    // Process Sending Verify Email
    //
    return res(HttpStatus.CREATED, newUser);
  }

  @Post('verifications')
  async verify(@Body() data: VerifyAccountDto) {

  }


  @UseGuards()
  @Put(':_id')
  async updateUser(@Param('_id') _id: string, @Body() data: RegisterUserDto, @Req() req: any) {
    const user = req.user;
    
    //
    const existedEmail = await this.usersService.findOne({ email: data.email });
    if (existedEmail) {
      throw new NotAcceptableException(
        'ERROR: Your request email already existed in FandB!',
      );
    }
    const newUser = await this.usersService.create(data);
    // TODO:
    // Process Sending Verify Email
    //
    return res(HttpStatus.CREATED, newUser);
  }
}
