import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class SupAditionalInfo1686074120013 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "suppliers",
      new TableColumn({
        name: "additional_info",
        type: "varchar",
        length: "255",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
