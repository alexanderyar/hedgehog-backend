import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class SupFormattedId1686077349600 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "suppliers",
      new TableColumn({
        name: "formatted_id",
        type: "varchar",
        length: "32",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
