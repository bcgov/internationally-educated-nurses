import { In, MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveDuplicateMilestones1663698520477 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const status_id_list = [
      '7B97462B-8600-41F5-AAFD-3672B38C8C85', // No position available
      '10277492-D10A-4EBD-9F50-39F4BE9D05F7', // HA was not interested
      '049E5172-578D-49CE-BC0D-631C4FC1965C', // Job competition cancelled
      '009761C9-A857-4E40-978A-9CBCC6F94E35', // Candidate withdrew from the job competition
      'E26EC530-2019-44FC-9784-D565BDD3FFDE', // Job offer accepted
    ];

    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('ien_applicant_status_audit')
      .where({ status: In(status_id_list) })
      .execute();

    await queryRunner.query(`
      UPDATE ien_applicants a
      SET status_id = (
        SELECT status_id
        FROM "ien_applicant_status_audit" s
        WHERE a.id = s.applicant_id
        ORDER BY s.start_date DESC
        LIMIT 1
      )
    `);

    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('ien_applicant_status')
      .where({ id: In(status_id_list) })
      .execute();
    await queryRunner.query(`
      INSERT INTO "ien_applicant_status"("id", "status", "category") VALUES ('3fd4f2b0-5151-d7c8-6bbc-3a0601b5e1ba','Candidate Withdrew from Competition','IEN Recruitment Process')
      `);
  }

  public async down(): Promise<void> {
    /* no rollback */
  }
}
