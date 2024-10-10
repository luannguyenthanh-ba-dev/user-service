import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DOWNLOAD_LINKS_SCHEMA_TOKEN } from './download-links.const';
import { Model, Types } from 'mongoose';
import { IDownloadLinksModel } from './interfaces/download-links.model.interface';
import { v4 as uuidv4 } from 'uuid';
import { IDownloadLinkFilters } from './interfaces/download-links.interface';
import { join } from 'path';
const SHA256 = require('crypto-js/sha256');

@Injectable()
export class DownloadLinksService {
  private downloadDes: string = '';
  private downloadServiceUrl: string = 'http://localhost:3001/api/v1/downloads';
  private logger: Logger = new Logger(DownloadLinksService.name);
  constructor(
    @InjectModel(DOWNLOAD_LINKS_SCHEMA_TOKEN)
    private readonly downloadLinksModel: Model<IDownloadLinksModel>,
  ) {
    this.downloadDes = process.env.DEFAULT_DOWNLOAD_DES;
    this.downloadServiceUrl = process.env.DOWNLOAD_SERVICE_URL;
  }

  async create(data: { client: Types.ObjectId | string }) {
    try {
      const slug = uuidv4();
      const token = SHA256(slug + data.client);
      const link = `${this.downloadServiceUrl}/${data.client}/${slug}/${token}`;
      const result = await this.downloadLinksModel.create({
        slug,
        client: data.client,
        link,
        token,
      });
      return result;
    } catch (error) {
      this.logger.error(`Create download link met ERROR: ${error.message}`);
      throw new NotImplementedException('Can not create download link!');
    }
  }

  async findOne(filters: IDownloadLinkFilters, select = '') {
    const conditions: any = {};
    if (filters._id) {
      conditions._id = filters._id;
    }
    if (filters.slug) {
      conditions.slug = filters.slug;
    }
    if (filters.client) {
      conditions.client = filters.client;
    }
    if (filters.link) {
      conditions.link = filters.link;
    }

    let query = this.downloadLinksModel.findOne(conditions);
    if (select.length) {
      query = query.select(select);
    }
    const result = await query;
    return result;
  }

  async deleteOne(filters: IDownloadLinkFilters) {
    const result = await this.downloadLinksModel.deleteOne(filters);
    return result;
  }

  processDesPath() {
    const directoryPath = join(__dirname, '..', '..', this.downloadDes);
    return directoryPath;
  }
}
