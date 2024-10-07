import { Types } from 'mongoose';
import { AIExperienceLevel } from '../clients.const';

export interface ICreateClient {
  name: string;
  email: string;
  industry?: string;
  aiExperienceLevel?: AIExperienceLevel;
  national?: string;
}

export interface IClientFilters {
  _id?: string | Types.ObjectId;
  name?: string;
  email?: string;

  industry?: string;
  aiExperienceLevel?: AIExperienceLevel;

  page?: string | number;
  limit?: string | number;

  from_time?: number;
  to_time?: number;
  isDeleted?: boolean;

  orderBy?: string;
  sort?: 'asc' | 'desc';
}
