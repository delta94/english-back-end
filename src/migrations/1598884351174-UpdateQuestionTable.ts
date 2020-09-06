import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateQuestionTable1598884351174 implements MigrationInterface {
    name = 'UpdateQuestionTable1598884351174';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `question` ADD `skillType` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `question` ADD `certificateType` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `question` DROP COLUMN `certificateType`");
        await queryRunner.query("ALTER TABLE `question` DROP COLUMN `skillType`");
    }

}
