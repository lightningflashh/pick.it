import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { env } from '~/config/environment'

import { User } from '~/entities/User'
import { Cart } from '~/entities/Cart'
import { CartItem } from '~/entities/CartItem'
import { Product } from '~/entities/Product'
import { ProductVariant } from '~/entities/ProductVariant'
import { Category } from '~/entities/Category'
import { Color } from '~/entities/Color'
import { Size } from '~/entities/Size'
import { Order } from '~/entities/Order'
import { OrderItem } from '~/entities/OrderItem'
import { Coupon } from '~/entities/Coupon'
import { OrderCoupon } from '~/entities/OrderCoupon'

let AppDataSource: DataSource | null = null

export const CONNECT_POSTGRESQL_DB = async (): Promise<DataSource> => {
  if (AppDataSource && AppDataSource.isInitialized) {
    return AppDataSource
  }

  try {
    AppDataSource = new DataSource({
      type: 'postgres',
      url: env.POSTGRES_URI,

      synchronize: true,
      logging: false,

      entities: [
        User,
        Cart,
        CartItem,
        Product,
        ProductVariant,
        Category,
        Color,
        Size,
        Order,
        OrderItem,
        Coupon,
        OrderCoupon
      ],

      migrations: ['src/migrations/*.ts']
    })

    await AppDataSource.initialize()

    console.log('PostgreSQL connected')
    return AppDataSource
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error)
    throw error
  }
}

export const GET_POSTGRESQL_DB = (): DataSource => {
  if (!AppDataSource || !AppDataSource.isInitialized) {
    throw new Error('PostgreSQL not connected. Call CONNECT_POSTGRESQL_DB first.')
  }
  return AppDataSource
}

export const CLOSE_POSTGRESQL_DB = async () => {
  if (AppDataSource && AppDataSource.isInitialized) {
    await AppDataSource.destroy()
    console.log('PostgreSQL disconnected')
  }
}
