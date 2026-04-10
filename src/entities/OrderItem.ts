import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, JoinColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm'
import { Order } from '~/entities/Order'
import { ProductVariant } from '~/entities/ProductVariant'

@Entity()
@Index(['order'])
@Index(['variant'])
@Index(['order', 'variant'])
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  order_item_id!: string

  @ManyToOne(() => Order, (o) => o.items)
  @JoinColumn({ name: 'order_id' })
  order!: Order

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant!: ProductVariant

  @Column({ type: 'int' })
  quantity!: number

  @Column('decimal', { precision: 12, scale: 2 })
  price!: number

  @Column({ type: 'varchar', length: 255 })
  product_name!: string

  @Column({ type: 'varchar', length: 255 })
  size_name!: string

  @Column({ type: 'varchar', length: 255 })
  color_name!: string

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
