// Controller to handle user profile operations

import { Response } from 'express'
import { prisma } from '../config/prisma.js'
import { hashPassword } from '../utils/bcrypt.js'

/* Retrieves the authenticated user's profile information from the database */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).sub

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        phone_verified: true,
        first_name: true,
        last_name: true,
        oauth_provider: true,
        oauth_id: true,
        created_at: true,
        updated_at: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ user })
  } catch (error: any) {
    console.error('getProfile error:', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/* Creates a new user (admin / authenticated creation) */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const normalizedEmail = String(email).toLowerCase().trim()

    const data: any = {
      email: normalizedEmail,
      first_name: first_name ?? undefined,
      last_name: last_name ?? undefined,
      phone: phone ?? undefined,
    }

    if (password) {
      data.password_hash = await hashPassword(String(password))
    }

    const user = await prisma.users.create({
      data,
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        phone_verified: true,
        created_at: true,
      },
    })

    return res.status(201).json({ user })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ error: 'Email already exists' })
    }
    console.error('createUser error:', error?.message ?? error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}