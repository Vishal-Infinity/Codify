//Routes for user-related endpoints
import { Router } from 'express'
import { getProfile, createUser } from '../controllers/user.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const userRouter = Router()
userRouter.get('/profile', authMiddleware, getProfile as any)
userRouter.post('/', authMiddleware, createUser as any) // Placeholder for future user creation

export default userRouter
