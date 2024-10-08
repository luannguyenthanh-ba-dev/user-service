import { Types } from "mongoose";

export interface IDownloadLinkFilters {
  _id?: Types.ObjectId | string;

  slug?: string;

  client?: Types.ObjectId | string;

  link?: string;

  token?: string;
}
