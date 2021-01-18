import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateToiecToToeic1610984685036 implements MigrationInterface {
    name = 'UpdateToiecToToeic1610984685036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE question set certificateType = 'Toeic' where certificateType = 'Toiec'`);
        await queryRunner.query(`UPDATE part set certificateType = 'Toeic' where certificateType = 'Toiec'`);
        await queryRunner.query(`UPDATE test_group set certificateType = 'Toeic' where certificateType = 'Toiec'`);
        await queryRunner.query(`UPDATE test_category set certificateType = 'Toeic' where certificateType = 'Toiec'`);
        await queryRunner.query(`UPDATE test set certificateType = 'Toeic' where certificateType = 'Toiec'`);
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {
        return;
    }

}
