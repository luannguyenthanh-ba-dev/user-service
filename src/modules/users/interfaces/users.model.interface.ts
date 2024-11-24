import { Document, Types } from 'mongoose';
import { Gender } from '../users.const';
import { ROLES, UserStatus } from 'src/common/utils';

/**
 * The common interface FAndModel - Must exactly equal to FAndModel. Field use camelCase. Extend Document for use when query!
 */
export interface IUserModel extends Document {
  readonly _id: Types.ObjectId;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone?: string;
  readonly address?: string;
  readonly birthday?: string;
  readonly height?: number;
  readonly weight?: number;
  readonly threeRounds?: Partial<{
    bust?: number;
    waist?: number;
    hips?: number;
  }>;
  readonly role: ROLES[];
  readonly gender?: Gender;
  readonly status?: UserStatus;
  readonly password?: string;
  readonly major?: string;
  readonly gallery?: string[];
  readonly avatar?: string;
  readonly isVerified?: boolean;
  // timestamp
  readonly createdAt?: number;
  readonly updatedAt?: number;
  readonly deletedAt?: number;
  readonly isDeleted?: boolean;
}
