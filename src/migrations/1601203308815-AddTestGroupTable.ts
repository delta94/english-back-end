import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTestGroupTable1601203308815 implements MigrationInterface {
    name = 'AddTestGroupTable1601203308815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `test_group` (`id` int NOT NULL AUTO_INCREMENT, `testGroupName` varchar(255) NOT NULL, `certificateType` varchar(255) NOT NULL, `isPublished` tinyint NOT NULL DEFAULT 0, `displayOrder` int NOT NULL DEFAULT 0, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deleteAt` datetime(6) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `test_category` ADD `testGroupId` int NULL");
        await queryRunner.query("ALTER TABLE `test_category` ADD CONSTRAINT `FK_e7dd91199fc7e4dd9c8957a8f49` FOREIGN KEY (`testGroupId`) REFERENCES `test_group`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test_category` DROP FOREIGN KEY `FK_e7dd91199fc7e4dd9c8957a8f49`");
        await queryRunner.query("ALTER TABLE `test_category` DROP COLUMN `testGroupId`");
        await queryRunner.query("DROP TABLE `test_group`");
    }

}
