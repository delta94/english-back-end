import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCertificatateTestGroup1601353091218 implements MigrationInterface {
    name = 'AddCertificatateTestGroup1601353091218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test_group` ADD `certificateType` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test_group` DROP COLUMN `certificateType`");
    }

}
