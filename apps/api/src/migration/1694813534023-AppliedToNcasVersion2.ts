import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppliedToNcasVersion21694813534023 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .update('ien_applicant_status')
      .set({ version: '1' })
      .where({ status: 'Referred to NCAS' })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('ien_applicant_status')
      .values({
        id: 'aad2e076-df00-4dab-a0cc-6a7f0bafc51b',
        status: 'Applied to NCAS',
        category: 'IEN Licensing/Registration Process',
      })
      .orIgnore(true)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .update('ien_applicant_status')
      .set({ version: '2' })
      .where({ status: 'Referred to NCAS' })
      .execute();
  }
}
