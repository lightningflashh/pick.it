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

export const AppDataSource = new DataSource({
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
