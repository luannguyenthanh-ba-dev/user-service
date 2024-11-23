import * as mongoose from 'mongoose';

export const EmailsDownloadSchema = new mongoose.Schema({
  client: String,

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
