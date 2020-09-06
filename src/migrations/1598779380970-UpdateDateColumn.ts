import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateDateColumn1598779380970 implements MigrationInterface {
    name = 'UpdateDateColumn1598779380970'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `question` CHANGE `deleteAt` `deleteAt` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `test` CHANGE `deleteAt` `deleteAt` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `test_question` CHANGE `deleteAt` `deleteAt` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `part` CHANGE `deleteAt` `deleteAt` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `test_category` CHANGE `deleteAt` `deleteAt` datetime(6) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test_category` CHANGE `deleteAt` `deleteAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `part` CHANGE `deleteAt` `deleteAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `test_question` CHANGE `deleteAt` `deleteAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `test` CHANGE `deleteAt` `deleteAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `question` CHANGE `deleteAt` `deleteAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
    }

}
