import {MigrationInterface, QueryRunner} from "typeorm";

export class QuestionRefresh1599975315718 implements MigrationInterface {
    name = 'QuestionRefresh1599975315718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test_question` ADD CONSTRAINT `FK_83d5c7eef8e2c2c3e4ea7b9e914` FOREIGN KEY (`questionId`) REFERENCES `question`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test_question` DROP FOREIGN KEY `FK_83d5c7eef8e2c2c3e4ea7b9e914`");
    }

}
