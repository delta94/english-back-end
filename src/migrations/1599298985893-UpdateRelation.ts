import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateRelation1599298985893 implements MigrationInterface {
    name = 'UpdateRelation1599298985893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query("DROP INDEX `REL_96030107294b71b508130e7954` ON `test_question`");
        await queryRunner.query("ALTER TABLE `asset` DROP COLUMN `name`");
        await queryRunner.query("ALTER TABLE `asset` ADD `name` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query("ALTER TABLE `user` CHANGE `password` `password` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `asset` DROP COLUMN `name`");
        await queryRunner.query("ALTER TABLE `asset` ADD `name` tinytext NOT NULL");
    }

}
