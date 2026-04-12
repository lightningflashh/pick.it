import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  Index,
} from 'typeorm'
import { RoleType } from '~/entities/role.enum'
import { Order } from '~/entities/Order'
import { Cart } from '~/entities/Cart'
import { Base } from '~/entities/Base'

@Entity()
export class User extends Base {
  @PrimaryGeneratedColumn('uuid')
  user_id!: string

  @Column({ unique: true, type: 'varchar', length: 255 })
  @Index()
  email!: string

  @Column({ type: 'varchar', length: 255 })
  password!: string

  @Column({ type: 'varchar', length: 255 })
  full_name!: string

  @Column({ nullable: true, type: 'varchar', length: 255 })
  phone?: string

  @Column({ nullable: true, type: 'text' })
  address?: string

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role!: RoleType

  @Column({ default: true, type: 'boolean' })
  is_active?: boolean

  @Column({ nullable: true, type: 'timestamp' })
  delete_at?: Date

  @OneToOne(() => Cart, (cart) => cart.user)
  cart!: Cart

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[]
}
