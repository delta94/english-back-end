import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTestCategory1598774913101 implements MigrationInterface {
    name = 'AddTestCategory1598774913101';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `test_category` (`id` int NOT NULL AUTO_INCREMENT, `testCategoryName` varchar(255) NOT NULL, `testSkillType` json NOT NULL, `isPublished` tinyint NOT NULL DEFAULT 0, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deleteAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `test` ADD `isPublished` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `isPublished`");
        await queryRunner.query("DROP TABLE `test_category`");
    }

}
