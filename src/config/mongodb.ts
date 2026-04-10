import { MongoClient, ServerApiVersion, Db } from 'mongodb'
import { env } from '~/config/environment'

let databaseInstance: Db | null = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI as string, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async (): Promise<Db> => {
  if (databaseInstance) return databaseInstance

  try {
    await mongoClientInstance.connect()
    databaseInstance = mongoClientInstance.db(env.DATABASE_NAME as string)

    console.log('MongoDB connected')
    return databaseInstance
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw error
  }
}

export const GET_DB = (): Db => {
  if (!databaseInstance) {
    throw new Error('Database not connected. Call CONNECT_DB first.')
  }
  return databaseInstance
}

export const CLOSE_DB = async () => {
  try {
    await mongoClientInstance.close()
    console.log('MongoDB disconnected')
  } catch (error) {
    console.error('Error closing MongoDB:', error)
  }
}
