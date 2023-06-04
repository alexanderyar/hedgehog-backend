import {MigrationInterface, QueryRunner, Table, TableColumn} from "typeorm"

export class Contracts1685073044664 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'contracts',
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
                    name: 'client_id',
                    type: 'integer',
                    isNullable: false,
                    isUnique: true
                }),
                new TableColumn({
                    name: 'file_name',
                    type: 'text',
                    isNullable: false
                }),
                new TableColumn({
                    name: 'file',
                    type: 'bytea',
                    isNullable: false
                })
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
