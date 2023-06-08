import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class TempPartNumberStocks1686195011148 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "stock_balances",
      new TableColumn({
        name: "part_number",
        type: "varchar",
        length: "32",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
