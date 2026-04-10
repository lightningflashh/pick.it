import 'reflect-metadata'
import express from 'express'
import { env } from '~/config/environment'

// PostgreSQL (TypeORM)
import { CONNECT_POSTGRESQL_DB } from '~/config/postgresql'

// MongoDB
import { CONNECT_DB } from '~/config/mongodb'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { APIs_V1 } from './routes/v1'

const app = express()

app.use(express.json())

app.use('/api/v1', APIs_V1)

app.use(errorHandlingMiddleware)

const START_SERVER = () => {
  app.listen(Number(env.LOCAL_DEV_APP_PORT), env.LOCAL_DEV_APP_HOST || 'localhost', () => {
    console.log(
      `Back-end Server is running successfully at Host: ${env.LOCAL_DEV_APP_HOST} and Port: ${env.LOCAL_DEV_APP_PORT}`
    )
  })
}
  ; (async () => {
    try {
      // connect PostgreSQL
      await CONNECT_POSTGRESQL_DB()
      console.log('PostgreSQL connected successfully')

      // connect MongoDB (review)
      await CONNECT_DB()
      console.log('MongoDB connected successfully')

      START_SERVER()
      console.log('Server started successfully')
    } catch (error) {
      console.error('Failed to connect to the database:', error)
      process.exit(1)
    }
  })()
