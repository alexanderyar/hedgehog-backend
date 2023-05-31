import { MigrationInterface, QueryRunner } from "typeorm";

export class TelephoneNullable1685412413831 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "users" ALTER COLUMN "telephone_number" DROP NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
