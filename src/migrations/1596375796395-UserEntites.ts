import {MigrationInterface, QueryRunner} from "typeorm";

export class UserEntites1596375796395 implements MigrationInterface {
    name = 'UserEntites1596375796395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `asset` (`url` varchar(255) NOT NULL, `useCount` int NOT NULL DEFAULT 1, `entity` enum ('ewebinar', 'user', 'team') NOT NULL, `entityId` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `image` json NULL, `video` json NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`url`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `profileMediaUrl` varchar(255) NULL, `email` varchar(255) NOT NULL, `displayEmail` varchar(255) NULL, `confirmationInvite` varchar(255) NULL, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NULL, `timezone` varchar(255) NOT NULL DEFAULT 'America/New_York', `phone` varchar(255) NULL, `company` varchar(255) NULL, `title` varchar(255) NULL, `bio` text NULL, `socialLinks` json NULL, `password` varchar(255) NULL DEFAULT NULL, `state` enum ('New', 'HasCreated', 'HasPublished') NOT NULL DEFAULT 'New', `isVerified` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `lms_english`.`query-result-cache` (`id` int NOT NULL AUTO_INCREMENT, `identifier` varchar(255) NULL, `time` bigint NOT NULL, `duration` int NOT NULL, `query` text NOT NULL, `result` text NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `lms_english`.`query-result-cache`");
        await queryRunner.query("DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`");
        await queryRunner.query("DROP TABLE `user`");
        await queryRunner.query("DROP TABLE `asset`");
    }

}
