import {MigrationInterface, QueryRunner} from "typeorm";

export class AddOnDeleteCASCADE1608137986142 implements MigrationInterface {
    name = 'AddOnDeleteCASCADE1608137986142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test_question` DROP FOREIGN KEY `FK_c8b1a4ade99193a3aaf3c981880`");
        await queryRunner.query("ALTER TABLE `test_question` ADD CONSTRAINT `FK_c8b1a4ade99193a3aaf3c981880` FOREIGN KEY (`testId`) REFERENCES `test`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `test_question` DROP FOREIGN KEY `FK_c8b1a4ade99193a3aaf3c981880`");
        await queryRunner.query("ALTER TABLE `test_question` ADD CONSTRAINT `FK_c8b1a4ade99193a3aaf3c981880` FOREIGN KEY (`testId`) REFERENCES `test`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
