import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTestsCategory1601043382377 implements MigrationInterface {
    name = 'AddTestsCategory1601043382377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test` ADD `testCategoryId` int NULL");
        await queryRunner.query("ALTER TABLE `test` ADD CONSTRAINT `FK_5237866512389fd6c6c59a859f9` FOREIGN KEY (`testCategoryId`) REFERENCES `test_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test` DROP FOREIGN KEY `FK_5237866512389fd6c6c59a859f9`");
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `testCategoryId`");
    }

}
