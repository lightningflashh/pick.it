import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCategoryAndProduct1775881352340 implements MigrationInterface {
    name = 'UpdateCategoryAndProduct1775881352340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0dce9bc93c2d2c399982d04bef"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0ae2d87ce6909f665d3402ba47"`);
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "category_id" TO "category_slug"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "category_slug"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "category_slug" character varying(255)`);
        await queryRunner.query(`CREATE INDEX "IDX_d7cf9c55e1fc04c672ce0f524b" ON "product" ("category_slug") `);
        await queryRunner.query(`CREATE INDEX "IDX_8caa7138d23bf8ce3d7e566320" ON "product" ("category_slug", "status") `);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_d7cf9c55e1fc04c672ce0f524b0" FOREIGN KEY ("category_slug") REFERENCES "category"("slug") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_d7cf9c55e1fc04c672ce0f524b0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8caa7138d23bf8ce3d7e566320"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d7cf9c55e1fc04c672ce0f524b"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "category_slug"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "category_slug" integer`);
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "category_slug" TO "category_id"`);
        await queryRunner.query(`CREATE INDEX "IDX_0ae2d87ce6909f665d3402ba47" ON "product" ("status", "category_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_0dce9bc93c2d2c399982d04bef" ON "product" ("category_id") `);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1" FOREIGN KEY ("category_id") REFERENCES "category"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
