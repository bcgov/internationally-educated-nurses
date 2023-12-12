import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGenericNursingEducation1702335836108 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `INSERT INTO public.ien_education(id, title) VALUES (8, 'Education') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM public.ien_education WHERE id=8`);
  }
}
