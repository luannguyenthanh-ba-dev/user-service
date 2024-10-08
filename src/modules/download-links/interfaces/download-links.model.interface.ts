import { Document, Types } from 'mongoose';
import { IClientsModel } from 'src/modules/clients/interfaces/clients.model.interface';

export interface IDownloadLinksModel extends Document {
  readonly _id: Types.ObjectId;

  readonly slug: string;

  // In TypeScript, the Partial<T> type allows you to create a new type with all the properties of type T, but with all properties set to optional
  readonly client: Types.ObjectId | Partial<IClientsModel>;

  readonly link: string;

  readonly token: string;

  // timestamp
  readonly createdAt?: number;
}
