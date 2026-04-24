import { IsNumber, IsEnum, IsDecimal, IsOptional, IsDateString } from 'class-validator'
import { DiscountType } from '~/entities/discountType.enum'

export class UpdateCouponDto {
  @IsNumber()
  coupon_id!: number

  @IsOptional()
  @IsEnum(DiscountType)
  discount_type?: DiscountType

  @IsOptional()
  @IsDecimal()
  discount_value?: number

  @IsOptional()
  @IsDecimal()
  max_discount?: number

  @IsOptional()
  @IsDecimal()
  min_order_value?: number

  @IsOptional()
  @IsDateString()
  start_date?: string

  @IsOptional()
  @IsDateString()
  end_date?: string

  @IsOptional()
  @IsNumber()
  usage_limit?: number
}
