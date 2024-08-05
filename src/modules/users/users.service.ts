import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Gender,
  USERS_SCHEMA_TOKEN,
  VERIFY_CODE_SCHEMA_TOKEN,
} from './users.const';
import { Model, Types } from 'mongoose';
import { IUserModel } from './interfaces/users.model.interface';
import { IUserFilters } from './interfaces/users.interface';
import { IVerificationsModel } from './interfaces/verifications.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(USERS_SCHEMA_TOKEN)
    private readonly usersModel: Model<IUserModel>,
    @InjectModel(VERIFY_CODE_SCHEMA_TOKEN)
    private readonly verificationsModel: Model<IVerificationsModel>,
  ) {}

  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    birthday?: string;
    gender?: Gender;
    password: string;
    major?: string;
  }) {
    const user = await this.usersModel.create(data);
    const rs = await this.usersModel.findById(user._id).select('-password');
    return rs;
  }

  /**
   * Find a user with filters
   * @param filters Object
   * @param select string - Select fields or exclude some data
   * @returns user
   */
  async findOne(filters: IUserFilters, select = '') {
    const conditions: any = {};
    if (filters._id) {
      conditions._id = filters._id;
    }
    if (filters.name) {
      conditions.$or = [
        { firstName: { $regex: filters.name, $options: 'i' } },
        { lastName: { $regex: filters.name, $options: 'i' } },
      ];
    }
    if (filters.email) {
      conditions.email = filters.email;
    }
    if (filters.phone) {
      conditions.phone = filters.phone;
    }
    if (filters.address) {
      conditions.address = filters.address;
    }
    if (filters.role) {
      conditions.role = filters.role;
    }
    if (filters.status) {
      conditions.status = filters.status;
    }
    if (filters.isVerified) {
      conditions.isVerified = filters.isVerified;
    }
    if (filters.from_time) {
      conditions.createdAt = { $gte: filters.from_time };
    }
    if (filters.to_time) {
      conditions.createdAt = { $lte: filters.to_time };
    }
    if (filters.isDeleted) {
      conditions.isDeleted = filters.isDeleted;
    }

    let query = this.usersModel.findOne(conditions);
    if (select.length) {
      query = query.select(select);
    }
    const user = await query;
    return user;
  }

  async generateVerifyCode(data: {
    userId: string | Types.ObjectId;
    email: string;
  }) {
    const verifyCode = await this.verificationsModel.findOneAndUpdate(
      { email: data.email },
      data,
      { new: true, upsert: true },
    );
    return verifyCode;
  }

  async findOneVerify(filters: {
    _id?: string | Types.ObjectId;
    email?: string;
    userId?: string | Types.ObjectId;
    verifyCode?: string;
  }) {
    const verifyCode = await this.verificationsModel.findOne({
      ...filters,
      createdAt: {
        $gte: Math.floor(Date.now() / 1000) - 15 * 60,
      },
    });
    return verifyCode;
  }

  async updateOne(
    filters: { _id?: string | Types.ObjectId; email?: string },
    data,
  ) {
    const updatedUser = await this.usersModel.findOneAndUpdate(filters, data, {
      new: true,
    });

    return updatedUser;
  }
}
