// Controller to handle OTP generation, sending, and verification for phone authentication

import { Request, Response } from 'express'
import { prisma } from '../config/prisma.js'
import twilio from 'twilio'
import { config } from '../config/env.js'

// Initialize Twilio client with credentials from environment
const client = twilio(config.twilioAccountSid, config.twilioAuthToken)

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' })
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // Expires in 5 minutes

    // Store OTP in database
    await prisma.otp_codes.create({
      data: {
        phone,
        code: otp,
        expires_at: expiresAt,
      },
    })

    // Send OTP via Twilio SMS
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: config.twilioPhone,
      to: phone,
    })

    return res.json({
      message: 'OTP sent successfully',
      phone: phone.replace(/./g, '*'), // Mask phone number in response
    })
  } catch (err: any) {
    console.error('sendOtp error:', err.message)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/* Verifies the OTP and marks the user's phone as verified */
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body

    // Validate input
    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required' })
    }

    // Validate user is authenticated
    const userId = req.user?.sub
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: No user ID' })
    }

    // Find valid, non-expired OTP
    const record = await prisma.otp_codes.findFirst({
      where: {
        phone,
        code: otp,
        expires_at: { gt: new Date() }, // Not expired
      },
    })

    if (!record) {
      return res.status(400).json({ error: 'Invalid or expired OTP' })
    }

    // Mark user phone as verified
    await prisma.users.update({
      where: { id: userId },
      data: {
        phone,
        phone_verified: true,
        updated_at: new Date(),
      },
    })

    // Remove used OTP(s) to prevent reuse
    await prisma.otp_codes.deleteMany({
      where: { phone, code: otp },
    })

    return res.json({ message: 'Phone verified successfully' })
  } catch (err: any) {
    console.error('verifyOtp error:', err.message)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
