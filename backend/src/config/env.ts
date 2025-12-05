// Load and validate environment variables from .env and expose a typed config object

import 'dotenv/config'

const required = [
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_NAME',
  'DATABASE_URL',
  'JWT_SECRET',
  'BCRYPT_SALT_ROUNDS',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE',
] as const

const missing = required.filter((k) => !process.env[k])
if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
}

const parseIntOr = (v: string | undefined, fallback: number) =>
  Number.isFinite(Number(v)) ? parseInt(v as string, 10) : fallback

export const config = {
  nodeEnv: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
  port: parseIntOr(process.env.PORT, 3000),

  // Database
  dbHost: process.env.DB_HOST as string,
  dbPort: parseIntOr(process.env.DB_PORT, 5432),
  dbUser: process.env.DB_USERNAME as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbName: process.env.DB_NAME as string,
  databaseUrl: process.env.DATABASE_URL as string,

  // Auth
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7D',

  // Bcrypt
  bcryptSaltRounds: Math.max(1, parseIntOr(process.env.BCRYPT_SALT_ROUNDS, 12)),

  // Twilio
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID as string,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN as string,
  twilioPhone: process.env.TWILIO_PHONE as string,
} as const
