// Initialize Prisma ORM client with PostgreSQL adapter for database operations

import { config } from './env.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.js'

if (!config.databaseUrl) {
  throw new Error('Missing required configuration: databaseUrl')
}

// Validate DATABASE_URL environment variable
const connectionString = config.databaseUrl
if (!connectionString) {
  throw new Error('Missing required environment variable: DATABASE_URL')
}

// Initialize Prisma client with PostgreSQL adapter
const adapter = new PrismaPg({ connectionString })
export const prisma = new PrismaClient({ adapter })

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})