import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm'
import { User } from '~/entities/User'
import { CartItem } from '~/entities/CartItem'

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  cart_id!: string

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: 'user_id' })
  user!: User

  @OneToMany(() => CartItem, (item) => item.cart, {
    cascade: true
  })
  items!: CartItem[]
}
