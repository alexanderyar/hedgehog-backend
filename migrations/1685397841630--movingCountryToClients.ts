import { MigrationInterface, QueryRunner } from "typeorm";

export class MovingCountryToClients1685397841630 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE clients ADD COLUMN country VARCHAR(128)"
    );
    await queryRunner.query(
      "UPDATE clients SET country = users.country FROM users WHERE clients.user_id = users.id"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
