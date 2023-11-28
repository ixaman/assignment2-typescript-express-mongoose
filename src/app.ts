import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import { UserRouters } from './app/modules/user.routes'

const app: Application = express()

// parser
app.use(express.json())
app.use(express.text())
app.use(cors())

app.use('/api/users', UserRouters)

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the api of Assignment2',
  })
})

export default app
