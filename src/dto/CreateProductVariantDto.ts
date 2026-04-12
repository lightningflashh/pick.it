import { Type } from 'class-transformer'
import { IsInt, IsNumber, IsString, IsUUID, Min } from 'class-validator'

export class CreateProductVariantDto {
  @IsString()
  @IsUUID()
  product_id!: string

  @Type(() => Number)
  @IsInt()
  @Min(1)
  color_id!: number

  @Type(() => Number)
  @IsInt()
  @Min(1)
  size_id!: number

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock!: number

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number
}
