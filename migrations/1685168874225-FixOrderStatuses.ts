import { MigrationInterface, QueryRunner } from "typeorm"

export class FixOrderStatuses1685168874225 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE order_statuses ADD VALUE IF NOT EXISTS 'manager_review';`)
        await queryRunner.query(`ALTER TYPE order_statuses rename to order_statuses_old;`)
        await queryRunner.query(`Create Type order_statuses as ENUM ('created', 'manager_review', 'payment_pending', 'packaging', 'delivery', 'delivered', 'cancelled');`)
        await queryRunner.query(`Update orders SET status = 'created' where status = 'in_progress';`)
        await queryRunner.query(`ALTER TABLE orders ALTER COLUMN status SET DATA TYPE order_statuses USING (status::TEXT::order_statuses); `)
        await queryRunner.query(`DROP TYPE IF EXISTS order_statuses_old;`)

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
