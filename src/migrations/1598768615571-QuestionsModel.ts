import {MigrationInterface, QueryRunner} from "typeorm";

export class QuestionsModel1598768615571 implements MigrationInterface {
    name = 'QuestionsModel1598768615571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `question` (`id` int NOT NULL AUTO_INCREMENT, `questionName` varchar(255) NOT NULL, `audioSec` int NOT NULL, `questionType` varchar(255) NOT NULL, `description` text NOT NULL, `content` text NOT NULL, `answers` json NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deleteAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `test` (`id` int NOT NULL AUTO_INCREMENT, `testName` varchar(255) NOT NULL, `skillType` varchar(255) NOT NULL, `autdioPartSecs` json NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deleteAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `test_question` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deleteAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `testId` int NULL, `questionId` int NULL, `partId` int NULL, UNIQUE INDEX `REL_83d5c7eef8e2c2c3e4ea7b9e91` (`questionId`), UNIQUE INDEX `REL_96030107294b71b508130e7954` (`partId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `part` (`id` int NOT NULL AUTO_INCREMENT, `partName` varchar(255) NOT NULL, `description` text NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deleteAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `test_question` ADD CONSTRAINT `FK_c8b1a4ade99193a3aaf3c981880` FOREIGN KEY (`testId`) REFERENCES `test`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `test_question` ADD CONSTRAINT `FK_83d5c7eef8e2c2c3e4ea7b9e914` FOREIGN KEY (`questionId`) REFERENCES `question`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `test_question` ADD CONSTRAINT `FK_96030107294b71b508130e79545` FOREIGN KEY (`partId`) REFERENCES `part`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test_question` DROP FOREIGN KEY `FK_96030107294b71b508130e79545`");
        await queryRunner.query("ALTER TABLE `test_question` DROP FOREIGN KEY `FK_83d5c7eef8e2c2c3e4ea7b9e914`");
        await queryRunner.query("ALTER TABLE `test_question` DROP FOREIGN KEY `FK_c8b1a4ade99193a3aaf3c981880`");
        await queryRunner.query("DROP TABLE `part`");
        await queryRunner.query("DROP INDEX `REL_96030107294b71b508130e7954` ON `test_question`");
        await queryRunner.query("DROP INDEX `REL_83d5c7eef8e2c2c3e4ea7b9e91` ON `test_question`");
        await queryRunner.query("DROP TABLE `test_question`");
        await queryRunner.query("DROP TABLE `test`");
        await queryRunner.query("DROP TABLE `question`");
    }

}
