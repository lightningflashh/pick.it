import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, JoinColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm'
import { Coupon } from '~/entities/Coupon'
import { Order } from '~/entities/Order'

@Entity()
@Index(['order', 'coupon'], { unique: true })
export class OrderCoupon {
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

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at!: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at!: Date
}
