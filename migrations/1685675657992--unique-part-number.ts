import { MigrationInterface, QueryRunner } from "typeorm";

export class UniquePartNumber1685675657992 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE nomenclatures ADD CONSTRAINT UQ_part_number UNIQUE (number)"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
