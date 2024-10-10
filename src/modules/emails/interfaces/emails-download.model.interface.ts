import { Document, Types } from 'mongoose';
import { IClientsModel } from 'src/modules/clients/interfaces/clients.model.interface';

export interface IEmailsDownloadModel extends Document {
  readonly _id: Types.ObjectId;

  // In TypeScript, the Partial<T> type allows you to create a new type with all the properties of type T, but with all properties set to optional
  readonly client: Types.ObjectId | Partial<IClientsModel>;

  readonly link: string;

  // timestamp
  readonly timestamp?: number;
}
