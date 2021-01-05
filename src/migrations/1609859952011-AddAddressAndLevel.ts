import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAddressAndLevel1609859952011 implements MigrationInterface {
    name = 'AddAddressAndLevel1609859952011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` ADD `address` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `user` ADD `level` enum ('Silver', 'Gold', 'Diamond') NULL");
        await queryRunner.query("ALTER TABLE `user` CHANGE `password` `password` varchar(255) NULL DEFAULT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` CHANGE `password` `password` varchar(255) CHARACTER SET \"utf8mb4\" COLLATE \"utf8mb4_general_ci\" NULL");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `level`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `address`");
    }

}
