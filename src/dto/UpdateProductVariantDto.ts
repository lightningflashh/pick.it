import { Type } from 'class-transformer'
import { IsInt, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator'

export class UpdateProductVariantDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  variant_id?: string

  @IsOptional()
  @IsString()
  @IsUUID()
  product_id?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  color_id?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size_id?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number
}
