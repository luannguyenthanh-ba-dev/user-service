import * as mongoose from 'mongoose';
import { UserStatus, ROLES, SALT_FACTOR, Gender } from '../users.const';
import { hasPassword } from 'src/common/utils';

export const UsersSchema = new mongoose.Schema(
  {
    firstName: {
      required: true,
      type: String,
    },
    lastName: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
    },
    phone: String,
    address: String,
    birthday: String,
    height: Number,
    weight: Number,
    threeRounds: {
      bust: Number,
      waist: Number,
      hips: Number,
    },
    role: {
      required: true,
      type: String,
      default: ROLES.USER,
    },
    gender: {
      type: Number,
      enum: Gender,
      default: Gender.UNKNOWN,
    },
    status: {
      type: String,
      default: UserStatus.PENDING,
    },
    password: {
      required: true,
      type: String,
    },
    major: String,
    gallery: [String],
    avatar: String,

    isVerified: {
      type: Boolean,
      default: false,
    },

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
UsersSchema.index({ email: 1 });

/**
 * Solve hash password
 */
UsersSchema.pre<any>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const user = this;

  // Hash password
  await hasPassword(user, SALT_FACTOR);
  next();
});
