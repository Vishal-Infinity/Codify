import { Request, Response, NextFunction, RequestHandler } from 'express'
import { verifyJwt } from '../utils/jwt.js'

// JWT payload shape
export interface JwtPayload {
  sub: string
  email: string
  iat?: number
  exp?: number
}

// Extend Express Request to include the decoded JWT payload
export interface AuthRequest extends Request {
  user?: JwtPayload
}

// Express-compatible middleware that verifies the Bearer token and sets req.user
export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = verifyJwt(token) as JwtPayload | null
    if (!decoded || !decoded.sub) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    ;(req as AuthRequest).user = decoded
    next()
  } catch (err: any) {
    console.error('authMiddleware error:', err?.message ?? err)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
