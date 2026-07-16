import { Type } from 'class-transformer'
import { IsInt, IsString, IsUUID, Min } from 'class-validator'

export class AddToCartDto {
  @IsString()
  @IsUUID()
  variant_id!: string

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number
}
