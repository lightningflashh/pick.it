import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany } from 'typeorm'
import { Product } from '~/entities/Product'

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  category_id!: number

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ unique: true, type: 'varchar', length: 255 })
  @Index()
  slug!: string

  @OneToMany(() => Product, (p) => p.category)
  products!: Product[]
}
