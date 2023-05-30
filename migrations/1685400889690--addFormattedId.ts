import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddFormattedId1685400889690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("clients", [
      new TableColumn({
        name: "formatted_id",
        type: "varchar",
        length: "64",
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
