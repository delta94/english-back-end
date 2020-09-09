import {MigrationInterface, QueryRunner} from "typeorm";

export class AddOrder1599387441787 implements MigrationInterface {
    name = 'AddOrder1599387441787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test_category` ADD `order` int NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `test` ADD `order` int NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `test_question` ADD `order` int NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `part` ADD `order` int NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `part` DROP COLUMN `order`");
        await queryRunner.query("ALTER TABLE `test_question` DROP COLUMN `order`");
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `order`");
        await queryRunner.query("ALTER TABLE `test_category` DROP COLUMN `order`");
    }

}
