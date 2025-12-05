// Utility helpers for hashing and verifying passwords with bcrypt

import bcrypt from 'bcryptjs'

const SALT_ROUNDS = Math.max(1, parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10))

/** Hash a plaintext password */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS)
  } catch (err: any) {
    console.error('hashPassword error:', err?.message ?? err)
    throw err
  }
}

/** Verify a plaintext password against a hash */
export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash)
  } catch (err: any) {
    console.error('verifyPassword error:', err?.message ?? err)
    throw err
  }
}
