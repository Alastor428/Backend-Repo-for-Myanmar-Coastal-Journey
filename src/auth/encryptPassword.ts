import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string):
Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}  //example: $2b$12$QvR3FhQ...

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
} // compare login password with hashed password