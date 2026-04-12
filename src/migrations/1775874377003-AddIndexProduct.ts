import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIndexProduct1775874377003 implements MigrationInterface {
  name = 'AddIndexProduct1775874377003'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE INDEX "IDX_22cc43e9a74d7498546e9a63e7" ON "product" ("name") ')
    await queryRunner.query('CREATE INDEX "IDX_0ae2d87ce6909f665d3402ba47" ON "product" ("category_id", "status") ')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "public"."IDX_0ae2d87ce6909f665d3402ba47"')
    await queryRunner.query('DROP INDEX "public"."IDX_22cc43e9a74d7498546e9a63e7"')
  }
}
