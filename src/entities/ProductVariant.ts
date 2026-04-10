import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, JoinColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm'
import { Product } from '~/entities/Product'
import { Color } from '~/entities/Color'
import { Size } from '~/entities/Size'

@Entity()
@Index(['product', 'color', 'size'])
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  variant_id!: string

  @ManyToOne(() => Product, (p) => p.variants)
  @JoinColumn({ name: 'product_id' })
  product!: Product

  @ManyToOne(() => Color)
  @JoinColumn({ name: 'color_id' })
  color!: Color

  @ManyToOne(() => Size)
  @JoinColumn({ name: 'size_id' })
  size!: Size

  @Column({ type: 'int' })
  stock!: number

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number

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
