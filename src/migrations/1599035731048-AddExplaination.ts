import {MigrationInterface, QueryRunner} from "typeorm";

export class AddExplaination1599035731048 implements MigrationInterface {
    name = 'AddExplaination1599035731048'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `question` ADD `explaination` text NOT NULL");
        await queryRunner.query("ALTER TABLE `question` CHANGE `answers` `answers` json NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `question` CHANGE `answers` `answers` json NULL");
        await queryRunner.query("ALTER TABLE `question` DROP COLUMN `explaination`");
    }

}
