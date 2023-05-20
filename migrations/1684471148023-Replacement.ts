import {MigrationInterface, QueryRunner, Table, TableColumn} from "typeorm"

export class Replacement1684471148023 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'replacements',
            columns: [
                new TableColumn({
                    name: 'id',
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    isUnique: true,
                    generationStrategy: "increment",
                }),
                new TableColumn({
                    name: 'nomenclature_id',
                    type: 'integer',
                    isNullable: false
                }),
                new TableColumn({
                    name: 'replacement_id',
                    type: 'integer',
                    isNullable: false
                })
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
