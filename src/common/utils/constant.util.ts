import { Types } from 'mongoose';

export enum ROLES {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
  VENDOR = 'vendor',
  PARTNER = 'partner',
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
  role?: string;
  gender?: number;
  status?: string;
  major?: string;
  gallery?: string[];
  avatar?: string;
  isVerified?: boolean;
  isDeleted?: boolean;
}
