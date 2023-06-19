import { MigrationInterface, QueryRunner } from "typeorm"

export class AddUniqueConstrainToReplacement1687069900708 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
ALTER TABLE replacements
ADD CONSTRAINT UC_Replacements UNIQUE (nomenclature_id, replacement_id);
`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
