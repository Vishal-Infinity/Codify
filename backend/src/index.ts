import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes.js'
import usersRoutes from './routes/user.routes.js'
import otpRoutes from './routes/otp.routes.js'
import { config } from './config/env.js'

const app = express()

app.use(express.json())
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'))

//Routes
app.use('/auth', authRoutes)
app.use('/users', usersRoutes)
app.use('/otp', otpRoutes)

const PORT = config.port || 3000

app.get('/', (req, res) => {
  res.send('Welcome to the Codify Backend API')
})

app.listen(PORT, () => {
  console.log(`🚀 Backend: http://localhost:${PORT}`)
})


