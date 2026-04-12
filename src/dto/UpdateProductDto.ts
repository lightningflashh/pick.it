import { IsString, IsBoolean, IsOptional } from 'class-validator'

export class UpdateProductDto {
  @IsString()
  product_id!: string

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  short_description?: string

  @IsOptional()
  @IsString()
  brand?: string

  @IsOptional()
  @IsBoolean()
  status?: boolean

  @IsOptional()
  @IsString()
  category_slug?: string
}
