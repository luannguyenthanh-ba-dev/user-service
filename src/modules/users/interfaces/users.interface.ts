import { Types } from "mongoose";
import { Gender, ROLES, UserStatus } from "../users.const";

export interface IUserFilters {
  _id?: string | Types.ObjectId;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;

  role?: ROLES;
  status?: UserStatus;

  isVerified?: boolean;

  from_time?: number;
  to_time?: number;
  isDeleted?: boolean;
}
