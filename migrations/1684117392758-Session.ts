import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm"

export class Session1684117392758 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'sessions',
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
                    name: 'user_id',
                    type: 'integer',
                    isNullable: false
                }),
                new TableColumn({
                    name: 'token',
                    type: 'text',
                    isNullable: true
                }),
                new TableColumn({
                    name: 'refresh_token',
                    type: 'text',
                    isNullable: true
                })
            ],
            foreignKeys: [
                new TableForeignKey({
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    columnNames: ["user_id"],
                    name: 'session_user',
                })
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
