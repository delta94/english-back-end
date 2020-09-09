import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeNameFieldOfTest1599366725254 implements MigrationInterface {
    name = 'ChangeNameFieldOfTest1599366725254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test` CHANGE `audioPartSecs` `partAndAudioSecs` json NULL");
        await queryRunner.query("ALTER TABLE `test_question` ADD CONSTRAINT `FK_96030107294b71b508130e79545` FOREIGN KEY (`partId`) REFERENCES `part`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test_question` DROP FOREIGN KEY `FK_96030107294b71b508130e79545`");
        await queryRunner.query("ALTER TABLE `test` CHANGE `partAndAudioSecs` `audioPartSecs` json NULL");
    }

}
