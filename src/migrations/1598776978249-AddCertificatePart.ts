import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCertificatePart1598776978249 implements MigrationInterface {
    name = 'AddCertificatePart1598776978249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `part` ADD `skillType` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `part` ADD `certificateType` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `user` CHANGE `password` `password` varchar(255) NULL DEFAULT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` CHANGE `password` `password` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `part` DROP COLUMN `certificateType`");
        await queryRunner.query("ALTER TABLE `part` DROP COLUMN `skillType`");
    }

}
