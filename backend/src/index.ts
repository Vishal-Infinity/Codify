import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes.js'
import usersRoutes from './routes/user.routes.js'
import otpRoutes from './routes/otp.routes.js'
import { config } from './config/env.js'

const app = express()

app.use(cors({ origin: config.frontendUrl }))
app.use(express.json())
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'))

//Routes
app.use('/auth', authRoutes)
app.use('/users', usersRoutes)
app.use('/otp', otpRoutes)

const PORT = config.port || 3000
app.listen(PORT, () => {
  console.log(`🚀 Backend: http://localhost:${PORT}`)
})


