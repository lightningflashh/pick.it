import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, JoinColumn } from 'typeorm'
import { Cart } from '~/entities/Cart'
import { ProductVariant } from '~/entities/ProductVariant'

@Entity()
@Index(['cart', 'variant'], { unique: true })
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  cart_item_id!: string

  @ManyToOne(() => Cart, (cart) => cart.items)
  @JoinColumn({ name: 'cart_id' })
  cart!: Cart

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant!: ProductVariant

  @Column({ type: 'int' })
  quantity!: number

  @Column('decimal', { precision: 10, scale: 2 })
  price_at_time!: number
}
