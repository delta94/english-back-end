import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateAsset1599289073835 implements MigrationInterface {
    name = 'UpdateAsset1599289073835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `asset` DROP COLUMN `entity`");
        await queryRunner.query("ALTER TABLE `asset` DROP COLUMN `entityId`");
        await queryRunner.query("ALTER TABLE `asset` DROP COLUMN `image`");
        await queryRunner.query("ALTER TABLE `asset` DROP COLUMN `useCount`");
        await queryRunner.query("ALTER TABLE `asset` DROP COLUMN `video`");
        await queryRunner.query("ALTER TABLE `asset` ADD `type` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `asset` ADD `file` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `asset` DROP COLUMN `type`");
        await queryRunner.query("ALTER TABLE `asset` ADD `video` json NULL");
        await queryRunner.query("ALTER TABLE `asset` ADD `useCount` int NOT NULL DEFAULT '1'");
        await queryRunner.query("ALTER TABLE `asset` ADD `image` json NULL");
        await queryRunner.query("ALTER TABLE `asset` ADD `entityId` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `asset` ADD `entity` enum ('ewebinar', 'user', 'team') NOT NULL");
        await queryRunner.query("ALTER TABLE `asset` DROP COLUMN `file`");
    }

}
