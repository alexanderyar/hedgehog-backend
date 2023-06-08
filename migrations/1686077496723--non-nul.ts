import { MigrationInterface, QueryRunner } from "typeorm";

export class NonNul1686077496723 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "suppliers" ALTER COLUMN "formatted_id" SET NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
