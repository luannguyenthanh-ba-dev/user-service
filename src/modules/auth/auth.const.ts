export const ROLES_KEY = 'roles';
export const ANY_USER = 'any_user';

/**
 * The secrect key for sign jwt -> generate token
 */
export const JWT_AUTH_SECRET = process.env.JWT_AUTH_SECRET || 'secrect_key';
export const JWT_EXPIRE_IN = process.env.JWT_EXPIRE_IN || '15d';
