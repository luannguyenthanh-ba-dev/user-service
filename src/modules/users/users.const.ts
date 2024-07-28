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

export const SALT_FACTOR = process.env.SALT_FACTOR || 12;
