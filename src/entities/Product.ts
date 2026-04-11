import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn
} from 'typeorm'
import { Category } from '~/entities/Category'
import { ProductVariant } from '~/entities/ProductVariant'
import { Base } from '~/entities/Base'

@Entity()
@Index(['category', 'status'])
export class Product extends Base {
  @PrimaryGeneratedColumn('uuid')
  product_id!: string

  @Column({ type: 'varchar', length: 255 })
  @Index()
  name!: string

  @Column({ nullable: true, type: 'text' })
  description?: string

  @Column({ nullable: true, type: 'varchar', length: 255 })
  short_description?: string

  @Column({ nullable: true, type: 'varchar', length: 255 })
  brand?: string

  @Column({ default: true, type: 'boolean' })
  status!: boolean

  @ManyToOne(() => Category, (c) => c.products)
  @JoinColumn({
    name: 'category_slug',
    referencedColumnName: 'slug'
  })
  @Index()
  category!: Category

  @OneToMany(() => ProductVariant, (v) => v.product)
  variants!: ProductVariant[]
}
