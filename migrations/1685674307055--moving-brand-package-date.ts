import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import Brands from "../src/enums/Brands";

export class MovingBrandPackageDate1685674307055 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("stock_balances", [
      new TableColumn({
        name: "brand",
        type: "enum",
        enum: Object.keys(Brands),
        enumName: "brands",
        default: `'${Brands.origin}'`,
      }),
      new TableColumn({
        name: "package",
        type: "varchar",
        length: "128",
        isNullable: true,
      }),
      new TableColumn({
        name: "manufacture_date",
        type: "varchar",
        length: "24",
        isNullable: true,
      }),
    ]);
    await queryRunner.query(
      "UPDATE stock_balances SET brand = nomenclatures.brand FROM nomenclatures WHERE stock_balances.nomenclature_id = nomenclatures.id"
    );
    await queryRunner.query(
      "UPDATE stock_balances SET package = nomenclatures.package FROM nomenclatures WHERE stock_balances.nomenclature_id = nomenclatures.id"
    );
    await queryRunner.query(
      "UPDATE stock_balances SET manufacture_date = nomenclatures.manufacture_date FROM nomenclatures WHERE stock_balances.nomenclature_id = nomenclatures.id"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
