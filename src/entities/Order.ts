import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

import { User } from './User'
import { OrderItem } from '~/entities/OrderItem'
import { OrderCoupon } from '~/entities/OrderCoupon'
import { OrderStatusType } from '~/entities/order-status.enum'
import { PaymentStatusType } from '~/entities/payment-status.enum'

@Entity()
@Index(['user'])
@Index(['status'])
@Index(['payment_status'])
@Index(['user', 'status', 'payment_status'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  order_id!: string

  @ManyToOne(() => User, (u) => u.orders)
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column('decimal', { precision: 12, scale: 2 })
  total_price!: number

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  discount_amount!: number

  @Column('decimal', { precision: 12, scale: 2 })
  final_price!: number

  @Column({ type: 'enum', enum: OrderStatusType })
  status!: OrderStatusType

  @Column({
    type: 'enum',
    enum: PaymentStatusType,
    default: PaymentStatusType.PENDING
  })
  payment_status!: PaymentStatusType

  @Column({ type: 'varchar', length: 255 })
  shipping_address!: string

  @Column({ nullable: true, type: 'text' })
  note?: string

  @OneToMany(() => OrderItem, (i) => i.order)
  items!: OrderItem[]

  @OneToMany(() => OrderCoupon, (oc) => oc.order)
  coupons!: OrderCoupon[]

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
