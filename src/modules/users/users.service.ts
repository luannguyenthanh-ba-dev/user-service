import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Gender, USERS_SCHEMA_TOKEN } from './users.const';
import { Model, Types } from 'mongoose';
import { IUserModel } from './interfaces/users.model.interface';
import { IUserFilters } from './interfaces/users.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(USERS_SCHEMA_TOKEN)
    private readonly usersModel: Model<IUserModel>,
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
   * @returns user
   */
  async findOne(filters: IUserFilters) {
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
    const user = await this.usersModel.findOne(conditions).select('-password');
    return user;
  }
}
