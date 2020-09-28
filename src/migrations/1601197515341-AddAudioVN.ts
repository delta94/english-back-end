import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAudioVN1601197515341 implements MigrationInterface {
    name = 'AddAudioVN1601197515341';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `question` ADD `audioSecVN` int NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `question` DROP COLUMN `audioSecVN`");
    }

}
