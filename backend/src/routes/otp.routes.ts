// Routes for OTP send/verify endpoints
import { Router } from 'express'
import { sendOtp, verifyOtp } from '../controllers/otp.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const otpRouter = Router()
otpRouter.post('/send', authMiddleware, sendOtp)
otpRouter.post('/verify', authMiddleware, verifyOtp)

export default otpRouter
