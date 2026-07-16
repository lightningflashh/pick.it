import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { env } from '~/config/environment'

import { CONNECT_POSTGRESQL_DB } from '~/config/postgresql'
import { CONNECT_DB } from '~/config/mongodb'

import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { APIs_V1 } from '~/routes/v1'
import cookieParser from 'cookie-parser'
import { corsOptions } from '~/config/cors'

const app = express()

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

app.use(cookieParser())

app.use(cors(corsOptions))

app.use(express.json())

app.use('/v1', APIs_V1)

app.use(errorHandlingMiddleware)

const START_SERVER = () => {
  app.listen(Number(env.LOCAL_DEV_APP_PORT), env.LOCAL_DEV_APP_HOST || 'localhost', () => {
    console.log(
      `Back-end Server is running successfully at: http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}`
    )
  })
}
  ; (async () => {
    try {
      await CONNECT_POSTGRESQL_DB()
      console.log('PostgreSQL connected successfully')

      await CONNECT_DB()
      console.log('MongoDB connected successfully')

      START_SERVER()
      console.log('Server started successfully')
    } catch (error) {
      console.error('Failed to connect to the database:', error)
      process.exit(1)
    }
  })()
