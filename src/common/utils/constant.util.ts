import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export enum ROLES {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
  VENDOR = 'vendor',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  PENDING = 'PENDING',
}

export interface IUserPayload {
  sub?: string | Types.ObjectId;
  _id?: string | Types.ObjectId;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  birthday?: string;
  height?: number;
  weight?: number;
  threeRounds?: object;
  role?: string[];
  gender?: number;
  status?: string;
  major?: string;
  gallery?: string[];
  avatar?: string;
  isVerified?: boolean;
  isDeleted?: boolean;
}

export class Order {
  @ApiProperty({
    type: String,
    required: false,
    example: 'createdAt',
  })
  orderBy: string;

  @ApiProperty({
    type: String,
    enum: ['asc', 'desc'],
    required: false,
    example: 'desc',
  })
  sort: 'asc' | 'desc';
}

export const CanManageObjects = (user: IUserPayload, object: any): boolean => {
  if (
    user.role.includes(ROLES.SUPER_ADMIN) ||
    user.role.includes(ROLES.ADMIN)
  ) {
    return true;
  }
  if (user.role.includes(ROLES.VENDOR) || user.role.includes(ROLES.USER)) {
    return object.ownerId === user._id;
  }
};
