import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JWT_AUTH_SECRET } from './auth.const';
import { UsersService } from '../users/users.service';
import { IUserPayload, UserStatus } from 'src/common/utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger();
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_AUTH_SECRET,
    });
  }

  async validate(payload: IUserPayload) {
    const user = await this.usersService.findOne({
      _id: payload._id,
      isDeleted: false,
      isVerified: true,
      status: UserStatus.ACTIVE,
    });
    if (!user) {
      throw new UnauthorizedException(
        'Error: Not found user for validate authen!',
      );
    }
    this.logger.log('Authenticated user!', payload.email);
    return {
      sub: payload?._id,
      _id: payload?._id,
      firstName: payload?.firstName,
      lastName: payload?.lastName,
      email: payload?.email,
      phone: payload?.phone,
      address: payload?.address,
      birthday: payload?.birthday,
      height: payload?.height,
      weight: payload?.weight,
      threeRounds: payload?.threeRounds,
      role: payload?.role,
      gender: payload?.gender,
      status: payload?.status,
      major: payload?.major,
      gallery: payload?.gallery,
      avatar: payload?.avatar,
      isVerified: payload?.isVerified,
      isDeleted: payload?.isDeleted,
    };
  }
}
