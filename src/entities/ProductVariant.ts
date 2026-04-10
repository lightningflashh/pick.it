import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn
} from 'typeorm'
import { Product } from '~/entities/Product'
import { Color } from '~/entities/Color'
import { Size } from '~/entities/Size'
import { Base } from '~/entities/Base'

@Entity()
@Index(['product', 'color', 'size'])
export class ProductVariant extends Base {
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
}
