import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { ProductVariant } from '~/entities/ProductVariant'
@Entity()
export class Color {
  @PrimaryGeneratedColumn()
  color_id!: number

  @Column({ unique: true, type: 'varchar', length: 255 })
  name!: string

  @OneToMany(() => ProductVariant, (v) => v.color)
  variants!: ProductVariant[]
}
