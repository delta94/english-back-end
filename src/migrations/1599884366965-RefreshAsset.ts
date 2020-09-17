import {MigrationInterface, QueryRunner} from "typeorm";

export class RefreshAsset1599884366965 implements MigrationInterface {
    name = 'RefreshAsset1599884366965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `asset` ADD `path` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `asset` DROP COLUMN `path`");
    }

}
