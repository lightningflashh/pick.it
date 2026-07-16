import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { ProductVariant } from '~/entities/ProductVariant'
import { Base } from '~/entities/Base'
@Entity()
export class Color extends Base {
  @PrimaryGeneratedColumn()
  color_id!: number

  @Column({ unique: true, type: 'varchar', length: 255 })
  name!: string

  @OneToMany(() => ProductVariant, (v) => v.color)
  variants!: ProductVariant[]
}
