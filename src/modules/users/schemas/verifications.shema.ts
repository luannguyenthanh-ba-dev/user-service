import * as mongoose from 'mongoose';
import { USERS_SCHEMA_TOKEN } from '../users.const';

export const VerificationsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: USERS_SCHEMA_TOKEN,
  },
  email: {
    type: String,
    required: true,
  },
  verifyCode: {
    type: String,
    required: true,
    maxlength: 6,
    default: Math.floor(Math.random() * 1000000).toString(),
  },
  createdAt: {
    type: Number,
    required: true,
    default: Math.floor(Date.now() / 1000),
    expires: 900,
  }, // expires at 15 min => when expired - verify code auto delete
});
