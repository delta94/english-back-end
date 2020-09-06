import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateTestCategoryTable1599141592785 implements MigrationInterface {
    name = 'UpdateTestCategoryTable1599141592785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test_category` CHANGE `testSkillType` `certificateType` json NOT NULL");
        await queryRunner.query("ALTER TABLE `test` ADD `testCategoryId` int NULL");
        await queryRunner.query("ALTER TABLE `test_category` DROP COLUMN `certificateType`");
        await queryRunner.query("ALTER TABLE `test_category` ADD `certificateType` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `test` ADD CONSTRAINT `FK_5237866512389fd6c6c59a859f9` FOREIGN KEY (`testCategoryId`) REFERENCES `test_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test` DROP FOREIGN KEY `FK_5237866512389fd6c6c59a859f9`");
        await queryRunner.query("ALTER TABLE `test_category` DROP COLUMN `certificateType`");
        await queryRunner.query("ALTER TABLE `test_category` ADD `certificateType` json NOT NULL");
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `testCategoryId`");
        await queryRunner.query("ALTER TABLE `test_category` CHANGE `certificateType` `testSkillType` json NOT NULL");
    }

}
