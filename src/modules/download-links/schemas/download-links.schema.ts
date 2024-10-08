import * as mongoose from 'mongoose';
import { CLIENTS_SCHEMA_TOKEN } from 'src/modules/clients/clients.const';
import { v4 as uuidv4 } from 'uuid';

export const DownloadLinksSchema = new mongoose.Schema(
  {
    slug: {
      required: true,
      type: String,
      unique: true,
      default: uuidv4(),
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: CLIENTS_SCHEMA_TOKEN,
    },

    link: {
      required: true,
      type: String,
      unique: true,
    },

    token: {
      required: true,
      type: String,
    },

    createdAt: {
      type: Number,
      required: true,
      default: Math.floor(Date.now() / 1000),
      expires: 900,
    }, // expires at 15 min => when expired - download link code auto delete
  },
  {
    timestamps: {
      currentTime: () => Math.floor(Date.now() / 1000),
    },
  },
);
