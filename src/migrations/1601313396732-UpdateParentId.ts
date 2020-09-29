import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateParentId1601313396732 implements MigrationInterface {
    name = 'UpdateParentId1601313396732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test_group` CHANGE `parentId` `parentId` varchar(255) NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test_group` CHANGE `parentId` `parentId` varchar(255) NULL");
    }

}
