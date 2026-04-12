import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateIndexForProductVariant1775992798345 implements MigrationInterface {
  name = 'UpdateIndexForProductVariant1775992798345'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "public"."IDX_8f16dd408545912a57578fb78d"')
    await queryRunner.query('CREATE INDEX "IDX_ddb5b746c0284a1f85d7623645" ON "product_variant" ("size_id") ')
    await queryRunner.query('CREATE INDEX "IDX_dd903be8fad7a34695ac233c28" ON "product_variant" ("color_id") ')
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_8f16dd408545912a57578fb78d" ON "product_variant" ("product_id", "color_id", "size_id") '
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "public"."IDX_8f16dd408545912a57578fb78d"')
    await queryRunner.query('DROP INDEX "public"."IDX_dd903be8fad7a34695ac233c28"')
    await queryRunner.query('DROP INDEX "public"."IDX_ddb5b746c0284a1f85d7623645"')
    await queryRunner.query(
      'CREATE INDEX "IDX_8f16dd408545912a57578fb78d" ON "product_variant" ("product_id", "color_id", "size_id") '
    )
  }
}
