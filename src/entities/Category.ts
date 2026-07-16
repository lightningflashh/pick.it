import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany } from 'typeorm'
import { Product } from '~/entities/Product'
import { Base } from '~/entities/Base'

@Entity()
export class Category extends Base {
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
