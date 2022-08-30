import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class UpdateApplicantIDType1661894034139 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('ien_applicants','applicant_id','applicant_id_old')
        await queryRunner.addColumn('ien_applicant_status',new TableColumn({
            type:'text',
            name:'applicant_id',
            isNullable:true
        }) )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('ien_applicants','applicant_id')
        await queryRunner.renameColumn ('ien_applicants','applicant_id_old','ien_applicant_id')
    }

}
