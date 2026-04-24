import { IsString, IsArray, IsOptional, ValidateNested, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateOrderItemDto {
  @IsString()
  variant_id!: string

  @IsString()
  product_name!: string

  @IsNumber()
  quantity!: number
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[]

  @IsString()
  shipping_address!: string

  @IsOptional()
  @IsString()
  note?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  coupon_codes?: string[]
}
