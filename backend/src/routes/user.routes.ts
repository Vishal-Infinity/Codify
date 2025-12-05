//Routes for user-related endpoints
import { Router } from 'express'
import { getProfile, createUser } from '../controllers/user.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const userRouter = Router()
userRouter.get('/profile', authMiddleware, getProfile)
userRouter.post('/', authMiddleware, createUser) // Placeholder for future user creation

export default userRouter
