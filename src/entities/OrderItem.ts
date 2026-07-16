import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, JoinColumn } from 'typeorm'
import { Order } from '~/entities/Order'
import { ProductVariant } from '~/entities/ProductVariant'
import { Base } from '~/entities/Base'

@Entity()
@Index(['order'])
@Index(['variant'])
@Index(['order', 'variant'])
export class OrderItem extends Base {
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
}
