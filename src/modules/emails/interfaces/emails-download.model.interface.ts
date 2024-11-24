import { Document, Types } from 'mongoose';

export interface IEmailsDownloadModel extends Document {
  readonly _id: Types.ObjectId;

  // In TypeScript, the Partial<T> type allows you to create a new type with all the properties of type T, but with all properties set to optional
  readonly client: string;

  readonly link: string;

  // timestamp
  readonly timestamp?: number;
}
