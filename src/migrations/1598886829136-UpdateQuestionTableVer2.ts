import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateQuestionTableVer21598886829136 implements MigrationInterface {
    name = 'UpdateQuestionTableVer21598886829136';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `question` ADD `result` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `question` DROP COLUMN `result`");
    }

}
