import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateBuildTable1599664583303 implements MigrationInterface {
    name = 'UpdateBuildTable1599664583303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test` DROP FOREIGN KEY `FK_5237866512389fd6c6c59a859f9`");
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `testCategoryId`");
        await queryRunner.query("ALTER TABLE `user` CHANGE `password` `password` varchar(255) NULL DEFAULT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` CHANGE `password` `password` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `test` ADD `testCategoryId` int NULL");
        await queryRunner.query("ALTER TABLE `test` ADD CONSTRAINT `FK_5237866512389fd6c6c59a859f9` FOREIGN KEY (`testCategoryId`) REFERENCES `test_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
