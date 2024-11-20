import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddEndOfJourneyToIenApplicants1732042370374 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the updated enum type for the new column
    await queryRunner.query(`
      CREATE TYPE "end_of_journey_enum" AS ENUM (
        'journey_complete',
        'journey_incomplete'
      )
    `);

    // Add the new column to the ien_applicants table
    await queryRunner.addColumn(
      'ien_applicants',
      new TableColumn({
        name: 'end_of_journey',
        type: 'end_of_journey_enum',
        isNullable: true, // Make it nullable
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the column
    await queryRunner.dropColumn('ien_applicants', 'end_of_journey');

    // Drop the enum type
    await queryRunner.query(`DROP TYPE "end_of_journey_enum"`);
  }
}
