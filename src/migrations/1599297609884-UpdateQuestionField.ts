import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateQuestionField1599297609884 implements MigrationInterface {
    name = 'UpdateQuestionField1599297609884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `question` CHANGE `description` `description` text NULL");
        await queryRunner.query("ALTER TABLE `question` CHANGE `content` `content` text NULL");
        await queryRunner.query("ALTER TABLE `question` CHANGE `explaination` `explaination` text NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `question` CHANGE `description` `description` text NOT NULL");
        await queryRunner.query("ALTER TABLE `question` CHANGE `content` `content` text NOT NULL");
        await queryRunner.query("ALTER TABLE `question` CHANGE `explaination` `explaination` NOT text NULL");
    }

}
