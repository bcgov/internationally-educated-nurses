import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSubmissionEntity1640046687865 implements MigrationInterface {
  name = 'AddSubmissionEntity1640046687865';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "submission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "payload" jsonb NOT NULL,
                "confirmation_id" character varying NOT NULL,
                "ches_id" character varying,
                "version" character varying NOT NULL,
                CONSTRAINT "PK_7faa571d0e4a7076e85890c9bd0" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "submission"`);
  }
}
