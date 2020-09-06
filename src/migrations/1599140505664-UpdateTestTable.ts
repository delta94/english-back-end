import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateTestTable1599140505664 implements MigrationInterface {
    name = 'UpdateTestTable1599140505664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test` ADD `description` text NOT NULL");
        await queryRunner.query("ALTER TABLE `test` ADD `certificateType` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `certificateType`");
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `description`");
    }

}
