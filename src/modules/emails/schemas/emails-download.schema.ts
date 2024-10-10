import * as mongoose from 'mongoose';
import { CLIENTS_SCHEMA_TOKEN } from 'src/modules/clients/clients.const';
import { v4 as uuidv4 } from 'uuid';

export const EmailsDownloadSchema = new mongoose.Schema({
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

  // Save the timestamp for checking time to send new download email - 1 minute - 1 mail - 1 client
  timestamp: {
    type: Number,
    required: true,
    default: Math.floor(Date.now() / 1000),
  },
});
