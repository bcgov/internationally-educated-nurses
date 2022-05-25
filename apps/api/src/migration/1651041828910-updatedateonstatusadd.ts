import { MigrationInterface, QueryRunner } from 'typeorm';

export class Updatedateonstatusadd1651041828910 implements MigrationInterface {
  name = 'updatedateonstatusadd1651041828910';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE OR REPLACE FUNCTION job_updated_date()
        RETURNS trigger AS
        $$
        BEGIN
            --code for Insert
            IF  (TG_OP = 'INSERT') THEN
              IF NEW.job_id IS NOT null THEN
                  UPDATE public.ien_applicant_jobs SET updated_date = NOW() WHERE id=NEW.job_id;
              END IF;
            END IF;

            --code for Update
            IF  (TG_OP = 'UPDATE') THEN
              IF OLD.job_id IS NOT null THEN
                  UPDATE public.ien_applicant_jobs SET updated_date = NOW() WHERE id=OLD.job_id;
              END IF;
            END IF;
            RETURN NEW;
        END;
        $$
        LANGUAGE 'plpgsql';`,
    );

    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_job_updated_date_on_status ON public.ien_applicant_status_audit;`,
    );

    await queryRunner.query(
      `CREATE TRIGGER trg_job_updated_date_on_status
        AFTER INSERT OR UPDATE ON public.ien_applicant_status_audit
        FOR EACH ROW EXECUTE PROCEDURE job_updated_date();`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_job_updated_date_on_status ON public.ien_applicant_status_audit;`,
    );
    await queryRunner.query(`DROP FUNCTION IF EXISTS job_updated_date;`);
  }
}
