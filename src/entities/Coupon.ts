import { Entity, PrimaryGeneratedColumn, Column, Index, UpdateDateColumn, CreateDateColumn } from 'typeorm'
import { DiscountType } from '~/entities/discounType.enum'
import { Base } from '~/entities/Base'

@Entity()
@Index(['code'], { unique: true })
@Index(['start_date', 'end_date'])
export class Coupon extends Base {
  @PrimaryGeneratedColumn()
  coupon_id!: number

  @Column({ unique: true, type: 'varchar', length: 255 })
  code!: string

  @Column({
    type: 'enum',
    enum: DiscountType
  })
  discount_type!: DiscountType

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  discount_value?: number

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  max_discount?: number

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  min_order_value?: number

  @Column({ type: 'timestamp' })
  start_date!: Date

  @Column({ type: 'timestamp' })
  end_date!: Date

  @Column({ type: 'int' })
  usage_limit!: number

  @Column({ default: 0, type: 'int' })
  used_count!: number

  @Column({ nullable: true, type: 'int' })
  usage_per_user?: number

  @Column({ default: true, type: 'boolean' })
  is_active!: boolean

  @Column({ nullable: true, type: 'text' })
  description?: string
}
