import { IsString, IsEnum, IsDecimal, IsOptional, IsDateString, IsNumber } from 'class-validator'
import { DiscountType } from '~/entities/discountType.enum'

export class CreateCouponDto {
  @IsString()
  code!: string

  @IsEnum(DiscountType)
  discount_type!: DiscountType

  @IsOptional()
  @IsDecimal()
  discount_value?: number

  @IsOptional()
  @IsDecimal()
  max_discount?: number

  @IsOptional()
  @IsDecimal()
  min_order_value?: number

  @IsDateString()
  start_date!: string

  @IsDateString()
  end_date!: string

  @IsNumber()
  usage_limit!: number
}
