import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { ProductVariant } from '~/entities/ProductVariant'
import { Base } from '~/entities/Base'

@Entity()
export class Size extends Base {
  @PrimaryGeneratedColumn()
  size_id!: number

  @Column({ unique: true, type: 'varchar', length: 255 })
  name!: string

  @OneToMany(() => ProductVariant, (v) => v.size)
  variants!: ProductVariant[]
}
