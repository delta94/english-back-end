import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDisplayOrder1601207861454 implements MigrationInterface {
    name = 'AddDisplayOrder1601207861454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test_category` ADD `displayOrderGroup` int NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `test` ADD `displayOrderCategory` int NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `displayOrderCategory`");
        await queryRunner.query("ALTER TABLE `test_category` DROP COLUMN `displayOrderGroup`");
    }

}
