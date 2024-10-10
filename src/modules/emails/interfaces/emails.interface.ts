import { Types } from 'mongoose';

export interface IDownloadEmailInput {
  client: Types.ObjectId | string;

  link: string;
}

export interface IDownloadEmailFilters {
  _id?: Types.ObjectId | string;

  client?: Types.ObjectId | string;

  link?: string;

  timestamp?: number;
}
