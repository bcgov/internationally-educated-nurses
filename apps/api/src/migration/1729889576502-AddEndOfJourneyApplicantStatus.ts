import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEndOfJourneyApplicantStatus1729889576502 implements MigrationInterface {
  milestones = [
    {
      id: '706d97bf-7e5a-4d3a-b283-fb3a9858c2ff',
      status: 'End of Journey - Journey Complete',
      category: 'IEN Licensing/Registration Process',
    },
    {
      id: '9fedd3db-a992-4672-afc0-fc27253170e1',
      status: 'End of Journey - Journey Incomplete',
      category: 'IEN Licensing/Registration Process',
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
