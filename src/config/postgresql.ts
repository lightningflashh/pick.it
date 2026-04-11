import { AppDataSource } from '~/config/data-source'

const instance = AppDataSource

export const CONNECT_POSTGRESQL_DB = async () => {
  if (!instance.isInitialized) {
    await instance.initialize()
    console.log('PostgreSQL connected')
  }
  return instance
}

export const GET_POSTGRESQL_DB = () => {
  if (!instance.isInitialized) {
    throw new Error('DB not connected')
  }
  return instance
}

export const CLOSE_POSTGRESQL_DB = async () => {
  if (instance.isInitialized) {
    await instance.destroy()
    console.log('PostgreSQL disconnected')
  }
}