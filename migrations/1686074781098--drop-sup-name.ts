import { MigrationInterface, QueryRunner } from "typeorm";

export class DropSupName1686074781098 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE suppliers DROP COLUMN name");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
