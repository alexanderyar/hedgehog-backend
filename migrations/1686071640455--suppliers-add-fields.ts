import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { SupplierTypes } from "../src/enums/SupplierTypes";

export class SuppliersAddFields1686071640455 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("suppliers", [
      new TableColumn({
        name: "company_name",
        type: "varchar",
        length: "127",
        isNullable: true,
      }),
      new TableColumn({
        name: "company_name_chinese",
        type: "varchar",
        length: "127",
        isNullable: true,
      }),
      new TableColumn({
        name: "address",
        type: "varchar",
        length: "255",
        isNullable: true,
      }),
      new TableColumn({
        name: "bank_info",
        type: "varchar",
        length: "255",
        isNullable: true,
      }),
      new TableColumn({
        name: "contact_name",
        type: "varchar",
        length: "64",
        isNullable: true,
      }),
      new TableColumn({
        name: "email",
        type: "varchar",
        length: "64",
        isNullable: true,
      }),
      new TableColumn({
        name: "type",
        type: "enum",
        enum: Object.keys(SupplierTypes),
        enumName: "supplierTypes",
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
