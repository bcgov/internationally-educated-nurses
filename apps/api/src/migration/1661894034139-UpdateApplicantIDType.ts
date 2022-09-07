import { IENApplicantStatusAudit } from 'src/applicant/entity/ienapplicant-status-audit.entity';
import { IENApplicantStatus } from 'src/applicant/entity/ienapplicant-status.entity';
import { IENApplicant } from 'src/applicant/entity/ienapplicant.entity';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateApplicantIDType1661894034139 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Clear old applicant statuses to make way for new ones.
    await queryRunner.connection
      .createQueryBuilder()
      .update(IENApplicant)
      .set({ status: undefined })
      .execute();
    // Applicant status audits will need to be deleted because they will be referencing status ids that do not exist
    await queryRunner.connection
      .createQueryBuilder()
      .delete()
      .from(IENApplicantStatusAudit)
      .execute();
    // Applicant statuses need to be delete because we do not have a mapping between the current ones and ones with new ids
    await queryRunner.connection.createQueryBuilder().delete().from(IENApplicantStatus).execute();

    await queryRunner.query(
      `ALTER TABLE "ien_applicants" DROP CONSTRAINT "FK_2a4f42fa3db57d0a519036e86f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT "FK_167d0e7e6a4a4c1cab226938914"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status" DROP CONSTRAINT "FK_9fe541de3226e5de1e5f0219f0f"`,
    );
    await queryRunner.dropPrimaryKey('ien_applicant_status');

    await queryRunner.changeColumn(
      'ien_applicant_status',
      'id',
      new TableColumn({
        type: 'uuid',
        name: 'id',
        isNullable: false,
        isUnique:true
      }),
    );

    await queryRunner.addColumn(
      'ien_applicant_status',
      new TableColumn({
        type: 'varchar',
        length: '256',
        isNullable: true,
        name: 'category',
        
      }),
    );

    // Rename id to id_old - milestones qsf
    await queryRunner.changeColumn(
      'ien_applicant_status_audit',
      'applicant_id',
      new TableColumn({
        type: 'uuid',
        name: 'applicant_id',
        isNullable: true,
        isUnique:true
      }),
    );
    console.log('Query 1 complete')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // milestones - drop new id column, then rename the old one.
    await queryRunner.dropColumn('ien_applicants_status', 'applicant_id');
    await queryRunner.addColumn(
      'ien_applicant_status',
      new TableColumn({
        type: 'integer',
        name: 'id',
        isNullable: true,
      }),
    );

    // applicants - drop new id column, then rename the old one.
    await queryRunner.dropColumn('ien_applicants', 'applicant_id');
    await queryRunner.addColumn(
      'ien_applicant_status',
      new TableColumn({
        type: 'integer',
        name: 'applicant_id',
        isNullable: true,
      }),
    );
  }
}
