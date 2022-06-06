import { MigrationInterface, QueryRunner } from 'typeorm';

export class IENStatusReasonTableAtler1654518303756 implements MigrationInterface {
  name = 'IENStatusReasonTableAtler1654518303756';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ien_status_reasons" ADD "i_e_n_program" boolean`);
    await queryRunner.query(`ALTER TABLE "ien_status_reasons" ADD "recruitment" boolean`);
    await queryRunner.query(
      `UPDATE public.ien_applicant_jobs SET job_title_id=null WHERE job_title_id IN (47, 48);`,
    );
    await queryRunner.query(`DELETE FROM public.ien_job_titles WHERE id IN (47, 48);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ien_status_reasons" DROP COLUMN "recruitment"`);
    await queryRunner.query(`ALTER TABLE "ien_status_reasons" DROP COLUMN "i_e_n_program"`);
  }
}
