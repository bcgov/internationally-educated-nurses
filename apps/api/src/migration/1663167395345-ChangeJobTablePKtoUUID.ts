import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeJobTablePKtoUUID1663166202169 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const jobTable = 'ien_applicant_jobs';
    const statusAuditTable = 'ien_applicant_status_audit';
    const jobLocationTable = 'ien_applicant_jobs_job_location_ien_job_locations';

    const oldJobs: { id: string; job_id: number }[] = await queryRunner.query(
      `SELECT id, job_id FROM "${statusAuditTable}" WHERE job_id IS NOT NULL`,
    );

    // alter status audit table
    await queryRunner.query(`
      ALTER TABLE "${statusAuditTable}" ADD COLUMN IF NOT EXISTS "temp_uid" uuid DEFAULT NULL;
    `);

    // map existing jobs with ids to uid column from ien_applicant_jobs
    await Promise.all(
      oldJobs
        .filter(job => job.job_id)
        .map(job => {
          return queryRunner.query(`
        UPDATE "${statusAuditTable}" s SET "temp_uid" = (SELECT uid FROM "${jobTable}" j WHERE j.id = '${job.job_id}')
        WHERE s.job_id = '${job.job_id}'
      `);
        }),
    );

    // alter job location ien job location table
    await queryRunner.query(`
      ALTER TABLE "${jobLocationTable}" ADD COLUMN IF NOT EXISTS "temp_uid" uuid DEFAULT NULL;
    `);

    const oldJobLocationIds: { ien_applicant_jobs_id: number }[] = await queryRunner.query(`
      SELECT ien_applicant_jobs_id FROM "${jobLocationTable}"
    `);

    // map existing jobs with ids to uid column from ien_applicant_jobs_job_location_ien_job_locations
    await Promise.all(
      oldJobLocationIds
        .filter(loc => loc.ien_applicant_jobs_id)
        .map(loc => {
          return queryRunner.query(`
        UPDATE "${jobLocationTable}" s SET "temp_uid" = (SELECT uid FROM "${jobTable}" j WHERE j.id = '${loc.ien_applicant_jobs_id}')
        WHERE s.ien_applicant_jobs_id = '${loc.ien_applicant_jobs_id}'
      `);
        }),
    );

    // statusAuditTable - drop constraint, column job_id and rename temp_uid to job_id
    await queryRunner.query(`
        ALTER TABLE "${statusAuditTable}" DROP CONSTRAINT "FK_ec2940cc497a06ba811763be464"
    `);

    await queryRunner.query(`
        ALTER TABLE "${statusAuditTable}" DROP COLUMN "job_id";
    `);

    await queryRunner.query(`
        ALTER TABLE "${statusAuditTable}" RENAME COLUMN "temp_uid" TO "job_id";
    `);

    // ien_applicant_jobs_job_location_ien_job_locations - drop constraint, column ien_applicant_jobs_id and rename temp_uid to ien_applicant_jobs_id
    await queryRunner.query(`
        ALTER TABLE "${jobLocationTable}" DROP CONSTRAINT "FK_4e8a99227d12fd8e7988b7d5b88"
    `);

    await queryRunner.query(`
        ALTER TABLE "${jobLocationTable}" DROP COLUMN "ien_applicant_jobs_id";
    `);

    await queryRunner.query(`
        ALTER TABLE "${jobLocationTable}" RENAME COLUMN "temp_uid" TO "ien_applicant_jobs_id";
    `);

    await queryRunner.dropPrimaryKey(jobTable);
    await queryRunner.dropColumn(jobTable, 'id');

    await queryRunner.changeColumn(
      jobTable,
      'uid',
      new TableColumn({
        type: 'uuid',
        name: 'id',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'uuid',
      }),
    );

    await queryRunner.query(`
      ALTER TABLE public.${statusAuditTable} ADD CONSTRAINT "FK_ec2940cc497a06ba811763be464" FOREIGN KEY (job_id) REFERENCES public.${jobTable}(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(`
      ALTER TABLE public.${jobLocationTable} ADD CONSTRAINT "FK_4e8a99227d12fd8e7988b7d5b88" FOREIGN KEY (ien_applicant_jobs_id) REFERENCES public.${jobTable}(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "unique_applicant_status_date_job"
      ON "ien_applicant_status_audit" (applicant_id, status_id, start_date, job_id)
      WHERE job_id IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const jobTable = 'ien_applicant_jobs';
    const statusAuditTable = 'ien_applicant_status_audit';
    const jobLocationTable = 'ien_applicant_jobs_job_location_ien_job_locations';
    let count = 0;

    // alter status audit table
    await queryRunner.query(`
      ALTER TABLE "${jobTable}" ADD COLUMN IF NOT EXISTS "temp_id" integer DEFAULT NULL;
    `);
    const jobsToUpdate: { id: string }[] = await queryRunner.query(`
      SELECT id FROM "${jobTable}"
    `);
    // map existing jobs with ids to uid column from ien_applicant_jobs
    await Promise.all(
      jobsToUpdate.map(({ id }) => {
        return queryRunner.query(`
        UPDATE "${jobTable}" j SET "temp_id" = ${count++} 
        WHERE j.id = '${id}
      `);
      }),
    );

    const oldJobs: { id: string; job_id: string }[] = await queryRunner.query(
      `SELECT id, job_id FROM "${statusAuditTable}" WHERE job_id IS NOT NULL`,
    );
    // alter status audit table
    await queryRunner.query(`
      ALTER TABLE "${statusAuditTable}" ADD COLUMN IF NOT EXISTS "temp_id" integer DEFAULT NULL;
    `);
    // map existing jobs with ids to uid column from ien_applicant_jobs
    await Promise.all(
      oldJobs
        .filter(job => job.job_id)
        .map(job => {
          return queryRunner.query(`
            UPDATE "${statusAuditTable}" s SET "temp_id" = (SELECT temp_id FROM "${jobTable}" j WHERE j.id = '${job.job_id}')
            WHERE s.job_id = '${job.job_id}'
          `);
        }),
    );
    // alter job location ien job location table
    await queryRunner.query(`
      ALTER TABLE "${jobLocationTable}" ADD COLUMN IF NOT EXISTS "temp_id" integer DEFAULT NULL;
    `);

    const oldJobLocationIds: { ien_applicant_jobs_id: string }[] = await queryRunner.query(`
      SELECT ien_applicant_jobs_id FROM "${jobLocationTable}"
    `);

    // map existing jobs with ids to uid column from ien_applicant_jobs_job_location_ien_job_locations
    await Promise.all(
      oldJobLocationIds
        .filter(loc => loc.ien_applicant_jobs_id)
        .map(loc => {
          return queryRunner.query(`
        UPDATE "${jobLocationTable}" s SET "temp_id" = (SELECT temp_id FROM "${jobTable}" j WHERE j.id = '${loc.ien_applicant_jobs_id}')
        WHERE s.ien_applicant_jobs_id = '${loc.ien_applicant_jobs_id}'
      `);
        }),
    );

    // statusAuditTable - drop constraint, column job_id and rename temp_uid to job_id
    await queryRunner.query(`
        ALTER TABLE "${statusAuditTable}" DROP CONSTRAINT "FK_ec2940cc497a06ba811763be464"
    `);

    await queryRunner.query(`
        ALTER TABLE "${statusAuditTable}" DROP COLUMN "job_id";
    `);

    await queryRunner.query(`
        ALTER TABLE "${statusAuditTable}" RENAME COLUMN "temp_id" TO "job_id";
    `);

    // ien_applicant_jobs_job_location_ien_job_locations - drop constraint, column ien_applicant_jobs_id and rename temp_uid to ien_applicant_jobs_id
    await queryRunner.query(`
        ALTER TABLE "${jobLocationTable}" DROP CONSTRAINT "FK_4e8a99227d12fd8e7988b7d5b88"
    `);

    await queryRunner.query(`
        ALTER TABLE "${jobLocationTable}" DROP COLUMN "ien_applicant_jobs_id";
    `);

    await queryRunner.query(`
        ALTER TABLE "${jobLocationTable}" RENAME COLUMN "temp_id" TO "ien_applicant_jobs_id";
    `);

    await queryRunner.dropPrimaryKey(jobTable);
    await queryRunner.dropColumn(jobTable, 'id');

    await queryRunner.changeColumn(
      jobTable,
      'temp_id',
      new TableColumn({
        type: 'integer',
        name: 'id',
        isPrimary: true,
        isGenerated: true,
      }),
    );

    await queryRunner.query(`
      ALTER TABLE public.${statusAuditTable} ADD CONSTRAINT "FK_ec2940cc497a06ba811763be464" FOREIGN KEY (job_id) REFERENCES public.${jobTable}(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(`
      ALTER TABLE public.${jobLocationTable} ADD CONSTRAINT "FK_4e8a99227d12fd8e7988b7d5b88" FOREIGN KEY (ien_applicant_jobs_id) REFERENCES public.${jobTable}(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "unique_applicant_status_date_job"
      ON "ien_applicant_status_audit" (applicant_id, status_id, start_date, job_id)
      WHERE job_id IS NOT NULL
    `);
  }
}
