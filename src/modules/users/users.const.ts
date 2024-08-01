export enum ROLES {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
  VENDOR = 'vendor',
  PARTNER = 'partner',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  PENDING = 'PENDING',
}

export enum Gender {
  MALE = 1,
  FEMALE = 2,
  UNKNOWN = 0,
}

export const SALT_FACTOR = process.env.SALT_FACTOR || 12;

export const USERS_SCHEMA_TOKEN = 'users';
export const VERIFY_CODE_SCHEMA_TOKEN = 'verifications';
