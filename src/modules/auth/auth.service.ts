import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Process Login
   * @param {IUsers} user Object
   * @returns
   */
  login(user: any) {
    const payload = {
      sub: user._id,
      _id: user?._id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phone: user?.phone,
      address: user?.address,
      birthday: user?.birthday,
      height: user?.height,
      weight: user?.weight,
      threeRounds: user?.threeRounds,
      role: user?.role,
      gender: user?.gender,
      status: user?.status,
      major: user?.major,
      gallery: user?.gallery,
      avatar: user?.avatar,
      isVerified: user?.isVerified,
      isDeleted: user?.isDeleted,
    };

    return this.jwtService.sign(payload);
  }
}
