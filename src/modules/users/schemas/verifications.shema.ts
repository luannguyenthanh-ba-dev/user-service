import * as mongoose from 'mongoose';
import { USERS_SCHEMA_TOKEN } from '../users.const';

export const VerificationSchema = new mongoose.Schema({
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
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 900,
  }, // expires at 15 min => when expired - verify code auto delete
});
