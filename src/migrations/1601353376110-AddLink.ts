import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLink1601353376110 implements MigrationInterface {
    name = 'AddLink1601353376110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test_group` ADD `link` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test_group` DROP COLUMN `link`");
    }

}
