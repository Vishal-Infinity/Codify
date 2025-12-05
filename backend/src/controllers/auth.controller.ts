// Controller to handle user authentication (register and login)

import { Request, Response } from 'express'
import { prisma } from '../config/prisma.js'
import { hashPassword, verifyPassword } from '../utils/bcrypt.js'
import { signJwt } from '../utils/jwt.js'

/** Registers a new user with email and password, returns JWT token */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    
    const passwordHash = await hashPassword(password)

    const user = await prisma.users.create({
      data: {
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
      },
      select: {
        id: true,
        email: true,
      },
    })

    const token = signJwt({
      sub: user.id,
      email: user.email,
    })

    return res.status(201).json({
      message: 'User registered',
      token,
      user: { id: user.id, email: user.email },
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already exists' })
    }
    console.error('register error:', error.message)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/** Authenticates user with email and password, returns JWT token */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user by email
    const user = await prisma.users.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        email: true,
        password_hash: true,
      },
    })

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = signJwt({ sub: user.id, email: user.email })

    return res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email },
    })
  } catch (error: any) {
    console.error('login error:', error.message)
    return res.status(500).json({ error: 'Internal server error' })
  }
}