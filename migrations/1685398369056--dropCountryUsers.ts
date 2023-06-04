import { MigrationInterface, QueryRunner } from "typeorm";

export class DropCountryUsers1685398369056 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE users DROP COLUMN country");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
