import { IsString, IsEmail, IsOptional, IsEnum, MinLength } from 'class-validator'
import { RoleType } from '~/entities/role.enum'

export class CreateUserDto {
  @IsEmail()
  email!: string

  @IsString()
  @MinLength(6)
  password!: string

  @IsString()
  full_name!: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsEnum(RoleType)
  role?: RoleType
}
