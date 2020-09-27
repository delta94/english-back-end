import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAudioUrl1601094612617 implements MigrationInterface {
    name = 'AddAudioUrl1601094612617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test` ADD `audioUrl` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `audioUrl`");
    }

}
