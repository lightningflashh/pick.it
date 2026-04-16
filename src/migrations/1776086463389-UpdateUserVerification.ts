import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateUserVerification1776086463389 implements MigrationInterface {
  name = 'UpdateUserVerification1776086463389'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" ADD "verify_token" character varying(255)')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "verify_token"')
  }
}
