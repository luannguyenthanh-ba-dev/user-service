import { Types } from 'mongoose';

export interface IVerificationsModel extends Document {
  readonly _id: Types.ObjectId;
  readonly userId: Types.ObjectId;
  readonly verifyCode: string;
  readonly email: string;
  readonly createdAt: number;
}
