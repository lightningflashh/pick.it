import { IsString, IsBoolean, IsOptional } from 'class-validator'

export class CreateProductDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  short_description?: string

  @IsOptional()
  @IsString()
  brand?: string

  @IsBoolean()
  status!: boolean

  @IsString()
  category_slug!: string
}
