import { MigrationInterface, QueryRunner } from "typeorm";

export class Drop1685675326819 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE nomenclatures DROP COLUMN brand");
    await queryRunner.query("ALTER TABLE nomenclatures DROP COLUMN package");
    await queryRunner.query(
      "ALTER TABLE nomenclatures DROP COLUMN manufacture_date"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
