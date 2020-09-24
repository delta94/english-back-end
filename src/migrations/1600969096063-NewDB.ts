import {MigrationInterface, QueryRunner} from "typeorm";

export class NewDB1600969096063 implements MigrationInterface {
    name = 'NewDB1600969096063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `asset` (`url` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `path` varchar(255) NOT NULL, `type` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`url`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `test` (`id` int NOT NULL AUTO_INCREMENT, `testName` varchar(255) NOT NULL, `description` text NOT NULL, `explaination` text NOT NULL, `skillType` varchar(255) NOT NULL, `certificateType` varchar(255) NOT NULL, `partAndAudioSecs` json NULL, `isPublished` tinyint NOT NULL DEFAULT 0, `displayOrder` int NOT NULL DEFAULT 0, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deleteAt` datetime(6) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `question` (`id` int NOT NULL AUTO_INCREMENT, `questionName` varchar(255) NOT NULL, `audioSec` int NOT NULL, `questionType` varchar(255) NOT NULL, `description` text NULL, `content` text NULL, `explaination` text NULL, `image` varchar(255) NOT NULL, `answers` json NOT NULL, `skillType` varchar(255) NOT NULL, `certificateType` varchar(255) NOT NULL, `result` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deleteAt` datetime(6) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `test_question` (`id` int NOT NULL AUTO_INCREMENT, `displayOrder` int NOT NULL DEFAULT 0, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deleteAt` datetime(6) NULL, `testId` int NULL, `questionId` int NULL, `partId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `part` (`id` int NOT NULL AUTO_INCREMENT, `partName` varchar(255) NOT NULL, `description` text NOT NULL, `skillType` varchar(255) NOT NULL, `certificateType` varchar(255) NOT NULL, `displayOrder` int NOT NULL DEFAULT 0, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deleteAt` datetime(6) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `test_category` (`id` int NOT NULL AUTO_INCREMENT, `testCategoryName` varchar(255) NOT NULL, `certificateType` varchar(255) NOT NULL, `isPublished` tinyint NOT NULL DEFAULT 0, `displayOrder` int NOT NULL DEFAULT 0, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deleteAt` datetime(6) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `profileMediaUrl` varchar(255) NULL, `email` varchar(255) NOT NULL, `displayEmail` varchar(255) NULL, `confirmationInvite` varchar(255) NULL, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NULL, `phone` varchar(255) NULL, `company` varchar(255) NULL, `title` varchar(255) NULL, `bio` text NULL, `socialLinks` json NULL, `password` varchar(255) NULL DEFAULT NULL, `state` enum ('New', 'HasCreated', 'HasPublished') NOT NULL DEFAULT 'New', `isVerified` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `test_question` ADD CONSTRAINT `FK_c8b1a4ade99193a3aaf3c981880` FOREIGN KEY (`testId`) REFERENCES `test`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `test_question` ADD CONSTRAINT `FK_83d5c7eef8e2c2c3e4ea7b9e914` FOREIGN KEY (`questionId`) REFERENCES `question`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `test_question` ADD CONSTRAINT `FK_96030107294b71b508130e79545` FOREIGN KEY (`partId`) REFERENCES `part`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("CREATE TABLE `lms_english`.`query-result-cache` (`id` int NOT NULL AUTO_INCREMENT, `identifier` varchar(255) NULL, `time` bigint NOT NULL, `duration` int NOT NULL, `query` text NOT NULL, `result` text NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `lms_english`.`query-result-cache`");
        await queryRunner.query("ALTER TABLE `test_question` DROP FOREIGN KEY `FK_96030107294b71b508130e79545`");
        await queryRunner.query("ALTER TABLE `test_question` DROP FOREIGN KEY `FK_83d5c7eef8e2c2c3e4ea7b9e914`");
        await queryRunner.query("ALTER TABLE `test_question` DROP FOREIGN KEY `FK_c8b1a4ade99193a3aaf3c981880`");
        await queryRunner.query("DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`");
        await queryRunner.query("DROP TABLE `user`");
        await queryRunner.query("DROP TABLE `test_category`");
        await queryRunner.query("DROP TABLE `part`");
        await queryRunner.query("DROP TABLE `test_question`");
        await queryRunner.query("DROP TABLE `question`");
        await queryRunner.query("DROP TABLE `test`");
        await queryRunner.query("DROP TABLE `asset`");
    }

}
