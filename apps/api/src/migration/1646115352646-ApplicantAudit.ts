import { MigrationInterface, QueryRunner } from 'typeorm';

export class ApplicantAudit1646115352646 implements MigrationInterface {
  name = 'ApplicantAudit1646115352646';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applicants" RENAME COLUMN "speciality" TO "specialty"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applicants" RENAME COLUMN "specialty" TO "speciality"`);
  }
}
