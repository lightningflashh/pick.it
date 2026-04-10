import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Index, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Category } from '~/entities/Category'
import { ProductVariant } from '~/entities/ProductVariant'

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  product_id!: string

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ nullable: true, type: 'text' })
  description?: string

  @Column({ nullable: true, type: 'varchar', length: 255 })
  short_description?: string

  @Column({ nullable: true, type: 'varchar', length: 255 })
  brand?: string

  @Column({ default: true, type: 'boolean' })
  status!: boolean

  @ManyToOne(() => Category, (c) => c.slug)
  @JoinColumn({ name: 'category_id' })
  @Index()
  category!: Category

  @OneToMany(() => ProductVariant, (v) => v.product)
  variants!: ProductVariant[]

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
