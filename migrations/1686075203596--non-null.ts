import { MigrationInterface, QueryRunner } from "typeorm";

export class NonNull1686075203596 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const columnsToModify = [
      "company_name",
      "company_name_chinese",
      "address",
      "bank_info",
      "contact_name",
      "email",
      "type",
    ];

    for (const columnName of columnsToModify) {
      await queryRunner.query(
        `ALTER TABLE "suppliers" ALTER COLUMN "${columnName}" SET NOT NULL`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
