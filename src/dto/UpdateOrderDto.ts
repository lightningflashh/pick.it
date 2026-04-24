import { IsString, IsOptional, IsEnum } from 'class-validator'
import { OrderStatusType } from '~/entities/orderStatus.enum'
import { PaymentStatusType } from '~/entities/paymentStatus.enum'

export class UpdateOrderDto {
  @IsString()
  order_id!: string

  @IsOptional()
  @IsEnum(OrderStatusType)
  status?: OrderStatusType

  @IsOptional()
  @IsEnum(PaymentStatusType)
  payment_status?: PaymentStatusType

  @IsOptional()
  @IsString()
  shipping_address?: string

  @IsOptional()
  @IsString()
  note?: string
}
