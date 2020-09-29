import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateTestGroup1601311226706 implements MigrationInterface {
    name = 'UpdateTestGroup1601311226706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test_group` CHANGE `certificateType` `parentId` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `test_group` CHANGE `parentId` `parentId` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test_group` CHANGE `parentId` `parentId` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `test_group` CHANGE `parentId` `certificateType` varchar(255) NOT NULL");
    }

}
