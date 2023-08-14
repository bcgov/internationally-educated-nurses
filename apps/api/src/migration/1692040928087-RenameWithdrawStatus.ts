import { IENApplicantStatus } from "src/applicant/entity/ienapplicant-status.entity"
import { MigrationInterface, QueryRunner } from "typeorm"

export class RenameWithdrawStatus1692040928087 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.connection.createQueryBuilder().update(IENApplicantStatus).set({
            status:'Not Proceeding'
        }).where({id:'F84A4167-A636-4B21-977C-F11AEFC486AF'}).execute()
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
