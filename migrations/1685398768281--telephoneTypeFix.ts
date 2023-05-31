import { MigrationInterface, QueryRunner } from "typeorm";

export class TelephoneTypeFix1685398768281 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE users ALTER COLUMN telephone_number TYPE NUMERIC"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
