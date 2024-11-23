import { Types } from 'mongoose';

export interface IDownloadEmailInput {
  client: string;

  link: string;
}

export interface IDownloadEmailFilters {
  _id?: Types.ObjectId | string;

  client?: string;

  link?: string;

  timestamp?: number;
}
