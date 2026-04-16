import { IsString, IsUUID } from 'class-validator'

export class RemoveFromCartDto {
  @IsString()
  @IsUUID()
  variant_id!: string
}
