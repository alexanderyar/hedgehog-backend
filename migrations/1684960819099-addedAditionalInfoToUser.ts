import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddedAditionalInfoToUser1684960819099
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("clients", [
      new TableColumn({
        name: "address",
        type: "varchar",
        length: "256",
        // default: `'${Brands.origin}'`,
        isNullable: true,
      }),
      new TableColumn({
        name: "ceo_name",
        type: "varchar",
        length: "256",
        isNullable: true,
      }),
      new TableColumn({
        name: "bank_info",
        type: "varchar",
        length: "256",
        isNullable: true,
      }),
      new TableColumn({
        name: "bill_to",
        type: "varchar",
        length: "256",
        isNullable: true,
      }),
      new TableColumn({
        name: "ship_to",
        type: "varchar",
        length: "256",
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
