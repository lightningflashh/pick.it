import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, JoinColumn } from 'typeorm'
import { Coupon } from '~/entities/Coupon'
import { Order } from '~/entities/Order'
import { Base } from '~/entities/Base'

@Entity()
@Index(['order', 'coupon'], { unique: true })
export class OrderCoupon extends Base {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => Order, (o) => o.coupons)
  @JoinColumn({ name: 'order_id' })
  order!: Order

  @ManyToOne(() => Coupon)
  @JoinColumn({ name: 'coupon_id' })
  coupon!: Coupon

  @Column('decimal', { precision: 12, scale: 2 })
  discount_amount!: number
}
