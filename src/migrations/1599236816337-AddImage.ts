import {MigrationInterface, QueryRunner} from "typeorm";

export class AddImage1599236816337 implements MigrationInterface {
    name = 'AddImage1599236816337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `question` ADD `image` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `question` DROP COLUMN `image`");
    }

}
