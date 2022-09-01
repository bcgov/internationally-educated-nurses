import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class UpdateAtsApplicantIdToUUID1662066445229 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.changeColumn('ien_applicants','applicant_id',new TableColumn({
        //     type:'uuid',
        //     name:'applicant_id',
        //     isNullable:true
        // }) ) 

        // await queryRunner.changeColumn('ien_applicants','status_id',new TableColumn({
        //     type:'uuid',
        //     name:'status_id',
        //     isNullable:true
        // }) ) 
        await queryRunner.changeColumn('ien_applicant_status_audit','status_id',new TableColumn({
            type:'uuid',
            name:'status_id',
            isNullable:true
        }) ) 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
