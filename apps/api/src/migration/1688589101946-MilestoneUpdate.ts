import { StatusCategory } from '@ien/common';
import { IENApplicantStatusAudit } from 'src/applicant/entity/ienapplicant-status-audit.entity';
import { IENApplicantStatus } from 'src/applicant/entity/ienapplicant-status.entity';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class MilestoneUpate1688589101946 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('ien_applicant_status',new TableColumn({name:'version',type:'varchar',length:'4',isNullable:false, default:'2'}))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('ien_applicant_status','version')
  }
}
