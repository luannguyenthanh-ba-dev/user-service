import * as bcrypt from 'bcryptjs';

/**
 * Has password function - Use for creature - register - update - change password
 * @param obj Object - The object for modifying password - object can be user || admin || another
 * @param saltFactor Number - SALT_SCRYPT - Number of rounds to use, defaults to 10 if omitted
 */
export const hasPassword = async (obj, saltFactor) => {
  const salt = await bcrypt.genSalt(saltFactor);
  const hash = await bcrypt.hash(obj.password, salt);
  obj.password = hash;
};

/**
 * Compare password
 * @param password String - Password before hash want to compare with hash - Login case || another case
 * @param account Object - That account request login
 */
export const comparePassword = async (password: string, account: any) => {
  const result = await bcrypt.compare(password, account.password);
  return result;
};
