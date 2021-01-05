import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateUserAndAddTokenTable1609670800857 implements MigrationInterface {
    name = 'UpdateUserAndAddTokenTable1609670800857'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `token` (`id` int NOT NULL AUTO_INCREMENT, `token` varchar(255) NOT NULL, `targetType` varchar(255) NOT NULL, `targetID` varchar(255) NOT NULL, `expiresAt` datetime NOT NULL, `tokenType` varchar(255) NOT NULL, UNIQUE INDEX `IDX_d9959ee7e17e2293893444ea37` (`token`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `displayEmail`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `confirmationInvite`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `company`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `title`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `state`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `bio`");
        await queryRunner.query("ALTER TABLE `user` ADD `isOps` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `user` ADD `role` enum ('Member', 'Ops', 'Admin') NOT NULL");
        await queryRunner.query("ALTER TABLE `user` ADD `version` int NOT NULL");
        await queryRunner.query("ALTER TABLE `user` CHANGE `password` `password` varchar(255) NULL DEFAULT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` CHANGE `password` `password` varchar(255) CHARACTER SET \"utf8mb4\" COLLATE \"utf8mb4_general_ci\" NULL");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `version`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `role`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `isOps`");
        await queryRunner.query("ALTER TABLE `user` ADD `bio` text CHARACTER SET \"utf8mb4\" COLLATE \"utf8mb4_general_ci\" NULL");
        await queryRunner.query("ALTER TABLE `user` ADD `state` enum ('New', 'HasCreated', 'HasPublished') CHARACTER SET \"utf8mb4\" COLLATE \"utf8mb4_general_ci\" NOT NULL DEFAULT 'New'");
        await queryRunner.query("ALTER TABLE `user` ADD `title` varchar(255) CHARACTER SET \"utf8mb4\" COLLATE \"utf8mb4_general_ci\" NULL");
        await queryRunner.query("ALTER TABLE `user` ADD `company` varchar(255) CHARACTER SET \"utf8mb4\" COLLATE \"utf8mb4_general_ci\" NULL");
        await queryRunner.query("ALTER TABLE `user` ADD `confirmationInvite` varchar(255) CHARACTER SET \"utf8mb4\" COLLATE \"utf8mb4_general_ci\" NULL");
        await queryRunner.query("ALTER TABLE `user` ADD `displayEmail` varchar(255) CHARACTER SET \"utf8mb4\" COLLATE \"utf8mb4_general_ci\" NULL");
        await queryRunner.query("DROP INDEX `IDX_d9959ee7e17e2293893444ea37` ON `token`");
        await queryRunner.query("DROP TABLE `token`");
    }

}
