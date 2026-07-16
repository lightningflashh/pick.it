import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm'
import { User } from '~/entities/User'
import { CartItem } from '~/entities/CartItem'
import { Base } from '~/entities/Base'

@Entity()
export class Cart extends Base {
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
