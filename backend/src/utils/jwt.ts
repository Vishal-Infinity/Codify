import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'

interface UserPayload {
  sub: string
  email: string
}

if (!config.jwtSecret) throw new Error('Missing JWT_SECRET') // runtime guard

export const signJwt = (payload: UserPayload): string => {
  return jwt.sign(payload as UserPayload, config.jwtSecret as any, { expiresIn: config.jwtExpiresIn as any})
}

export const verifyJwt = (token: string): UserPayload => {
  return jwt.verify(token, config.jwtSecret) as UserPayload
}
