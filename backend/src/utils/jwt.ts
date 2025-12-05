import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'

interface UserPayload {
  sub: string
  email: string
}

if (!config.jwtSecret) throw new Error('Missing JWT_SECRET') // runtime guard

export const signJwt = (payload: UserPayload): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn })
}

export const verifyJwt = (token: string): UserPayload => {
  return jwt.verify(token, config.jwtSecret) as UserPayload
}
