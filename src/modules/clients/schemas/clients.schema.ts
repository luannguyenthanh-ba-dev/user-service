import * as mongoose from 'mongoose';
import { AIExperienceLevel } from '../clients.const';

export const ClientsSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    industry: String,
    aiExperienceLevel: {
      type: String,
      enum: AIExperienceLevel,
      default: AIExperienceLevel.Beginner,
    },
    national: String,

    createdAt: Number,
    updatedAt: Number,
    deletedAt: Number,
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: {
      currentTime: () => Math.floor(Date.now() / 1000),
    },
  },
);

// Add index = email
ClientsSchema.index({ email: 1 });
