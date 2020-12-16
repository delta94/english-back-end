import {MigrationInterface, QueryRunner} from "typeorm";

export class AddQuickExplaination1602329108790 implements MigrationInterface {
    name = 'AddQuickExplaination1602329108790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `question` ADD `quickExplaination` text NULL");
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `description`");
        await queryRunner.query("ALTER TABLE `test` ADD `description` text NOT NULL");
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `explaination`");
        await queryRunner.query("ALTER TABLE `test` ADD `explaination` text NOT NULL");
        await queryRunner.query("ALTER TABLE `question` DROP COLUMN `description`");
        await queryRunner.query("ALTER TABLE `question` ADD `description` text NULL");
        await queryRunner.query("ALTER TABLE `question` DROP COLUMN `content`");
        await queryRunner.query("ALTER TABLE `question` ADD `content` text NULL");
        await queryRunner.query("ALTER TABLE `part` DROP COLUMN `description`");
        await queryRunner.query("ALTER TABLE `part` ADD `description` text NOT NULL");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `bio`");
        await queryRunner.query("ALTER TABLE `user` ADD `bio` text NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `bio`");
        await queryRunner.query("ALTER TABLE `user` ADD `bio` mediumtext CHARACTER SET \"utf8mb4\" COLLATE \"utf8mb4_general_ci\" NULL");
        await queryRunner.query("ALTER TABLE `part` DROP COLUMN `description`");
        await queryRunner.query("ALTER TABLE `part` ADD `description` mediumtext CHARACTER SET \"utf8mb4\" COLLATE \"utf8mb4_general_ci\" NOT NULL");
        await queryRunner.query("ALTER TABLE `question` DROP COLUMN `content`");
        await queryRunner.query("ALTER TABLE `question` ADD `content` mediumtext CHARACTER SET \"utf8mb4\" COLLATE \"utf8mb4_general_ci\" NULL");
        await queryRunner.query("ALTER TABLE `question` DROP COLUMN `description`");
        await queryRunner.query("ALTER TABLE `question` ADD `description` mediumtext CHARACTER SET \"utf8mb4\" COLLATE \"utf8mb4_general_ci\" NULL");
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `explaination`");
        await queryRunner.query("ALTER TABLE `test` ADD `explaination` mediumtext CHARACTER SET \"utf8mb4\" COLLATE \"utf8mb4_general_ci\" NOT NULL");
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `description`");
        await queryRunner.query("ALTER TABLE `test` ADD `description` mediumtext CHARACTER SET \"utf8mb4\" COLLATE \"utf8mb4_general_ci\" NOT NULL");
        await queryRunner.query("ALTER TABLE `question` DROP COLUMN `quickExplaination`");
    }

}
