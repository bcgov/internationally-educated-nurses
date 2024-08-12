import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewBccnmApplicantStatus1720706400000 implements MigrationInterface {
  milestones = [
    {
      id: '4b80c52a-1f3a-445b-a2e7-89fc7bafc3cd',
      status: 'BCCNM Application Complete Date',
      category: 'IEN Licensing/Registration Process',
    },
    {
      id: '99c8308e-91b5-41b5-b3a3-d7eb17c942b7',
      status: 'BCCNM Decision Date',
      category: 'IEN Licensing/Registration Process',
    },
    {
      id: '9fbf3ab7-4f5a-4936-b24b-4c7f62ad1b99',
      status: 'BCCNM Registration Date',
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
