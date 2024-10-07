import { Document, Types } from 'mongoose';
import { AIExperienceLevel } from '../clients.const';

/**
 * The common interface ClientsModel - Must exactly equal to ClientsModel. Field use camelCase. Extend Document for use when query!
 */
export interface IClientsModel extends Document {
  readonly _id: Types.ObjectId;
  readonly name: string;
  readonly email: string;
  readonly industry?: string;
  readonly aiExperienceLevel?: AIExperienceLevel;
  readonly national?: string;
  // timestamp
  readonly createdAt?: number;
  readonly updatedAt?: number;
  readonly deletedAt?: number;
  readonly isDeleted?: boolean;
}
