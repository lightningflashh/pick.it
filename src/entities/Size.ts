import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm'
import { ProductVariant } from '~/entities/ProductVariant'

@Entity()
export class Size {
  @PrimaryGeneratedColumn()
  size_id!: number

  @Column({ unique: true, type: 'varchar', length: 255 })
  name!: string

  @OneToMany(() => ProductVariant, (v) => v.size)
  variants!: ProductVariant[]
}
