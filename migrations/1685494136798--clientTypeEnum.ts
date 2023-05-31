import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ClientTypeEnum1685494136798 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "clients",
      "type",
      new TableColumn({
        name: "type",
        type: "enum",
        enum: ["manufacturer", "trader"],
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
