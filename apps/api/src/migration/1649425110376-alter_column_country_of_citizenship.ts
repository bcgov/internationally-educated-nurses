import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterColumnCountryOfCitizenship1649425110376 implements MigrationInterface {
  name = 'alterColumnCountryOfCitizenship1649425110376';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "country_of_citizenship"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "country_of_citizenship" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "country_of_citizenship"`);
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" ADD "country_of_citizenship" character varying`,
    );
  }
}
