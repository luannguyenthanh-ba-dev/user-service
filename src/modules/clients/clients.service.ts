import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CLIENTS_SCHEMA_TOKEN } from './clients.const';
import { Model, Types } from 'mongoose';
import { IClientsModel } from './interfaces/clients.model.interface';
import { IClientFilters, ICreateClient } from './interfaces/clients.interface';
import { pagination } from 'src/common/utils';

@Injectable()
export class ClientsService {
  private logger: Logger = new Logger(ClientsService.name);

  constructor(
    @InjectModel(CLIENTS_SCHEMA_TOKEN)
    private readonly clientsModel: Model<IClientsModel>,
  ) {}

  async create(data: ICreateClient) {
    try {
      const result = await this.clientsModel.create(data);
      this.logger.log(`Add new client: ${data.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Add new client met ERROR: ${error.message}`);
      throw new NotImplementedException('Can not add new client!');
    }
  }

  async updateOne(
    filters: { _id?: string | Types.ObjectId; email?: string },
    data,
  ) {
    try {
      const result = await this.clientsModel.findOneAndUpdate(filters, data, {
        new: true,
      });

      return result;
    } catch (error) {
      this.logger.error(`Update client met ERROR: ${error.message}`);
      throw new NotImplementedException('Can not update client!');
    }
  }

  /**
   * Find a clients with filters
   * @param filters Object
   * @param select string - Select fields or exclude some data
   * @returns clients
   */
  async findOne(filters: IClientFilters, select = '') {
    const conditions: any = {};
    if (filters._id) {
      conditions._id = filters._id;
    }
    if (filters.name) {
      conditions.name = { $regex: filters.name, $options: 'i' };
    }
    if (filters.email) {
      conditions.email = filters.email;
    }
    if (filters.aiExperienceLevel) {
      conditions.aiExperienceLevel = filters.aiExperienceLevel;
    }
    if (filters.industry) {
      conditions.industry = { $regex: filters.industry, $options: 'i' };
    }
    if (filters.from_time) {
      conditions.createdAt = { $gte: filters.from_time };
    }
    if (filters.to_time) {
      conditions.createdAt = { $lte: filters.to_time };
    }
    if (filters.isDeleted || filters.isDeleted === false) {
      conditions.isDeleted = filters.isDeleted;
    }

    let query = this.clientsModel.findOne(conditions);
    if (select.length) {
      query = query.select(select);
    }
    const client = await query;
    return client;
  }

  async findManyByFilters(filters: IClientFilters, select = '') {
    const conditions: any = {};
    if (filters._id) {
      conditions._id = filters._id;
    }
    if (filters.name) {
      conditions.name = { $regex: filters.name, $options: 'i' };
    }
    if (filters.email) {
      conditions.email = filters.email;
    }
    if (filters.aiExperienceLevel) {
      conditions.aiExperienceLevel = filters.aiExperienceLevel;
    }
    if (filters.industry) {
      conditions.industry = { $regex: filters.industry, $options: 'i' };
    }
    if (filters.from_time) {
      conditions.createdAt = { $gte: filters.from_time };
    }
    if (filters.to_time) {
      conditions.createdAt = { $lte: filters.to_time };
    }
    if (filters.isDeleted || filters.isDeleted === false) {
      conditions.isDeleted = filters.isDeleted;
    }

    let query = this.clientsModel.find(conditions);

    if (filters.orderBy && filters.sort) {
      if (filters.sort === 'asc') {
        query = query.sort({ [filters.orderBy]: 1 });
      }
      if (filters.sort === 'desc') {
        query = query.sort({ [filters.orderBy]: -1 });
      }
    }

    if (filters.limit && filters.page) {
      const { start, limit } = pagination(filters.page, filters.limit);
      query = query.limit(limit).skip(start);
    }

    if (select.length) {
      query = query.select(select);
    }
    const [result, total] = await Promise.all([
      query,
      this.clientsModel.countDocuments(conditions),
    ]);
    return { result, total };
  }
}
