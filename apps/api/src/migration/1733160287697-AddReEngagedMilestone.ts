import { MigrationInterface, QueryRunner } from 'typeorm';
import { StatusCategory } from '@ien/common';

export class AddReEngagedMilestone1733160287697 implements MigrationInterface {
  milestones = [
    {
      id: 'e1a1b3f4-2d4b-4c3e-9a1b-6f4e7d8c9b0a',
      status: 'Re-engaged',
      category: StatusCategory.SYSTEM,
    },
  ];

  private async addMilestones(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('ien_applicant_status')
      .values(this.milestones)
      .orIgnore(true)
      .execute();
  }
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.addMilestones(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const ids = this.milestones.map(milestone => milestone.id);

    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('ien_applicant_status')
      .whereInIds(ids)
      .execute();
  }
}
