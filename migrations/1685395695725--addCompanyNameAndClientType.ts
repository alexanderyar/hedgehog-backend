import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCompanyNameAndClientType1685395695725
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("clients", [
      new TableColumn({
        name: "company_name",
        type: "varchar",
        length: "256",
        isNullable: true,
      }),
      new TableColumn({
        name: "type",
        type: "varchar",
        length: "20",
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
