import { IsEmail, IsUUID } from 'class-validator'

export class VerifyAccountDto {
  @IsEmail()
  email!: string

  @IsUUID()
  token!: string
}