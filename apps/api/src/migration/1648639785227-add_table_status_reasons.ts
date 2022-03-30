import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTableStatusReasons1648639785227 implements MigrationInterface {
  name = 'addTableStatusReasons1648639785227';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ien_status_reasons" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_73ef30906188776d57813b94fc2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "ien_status_reasons"`);
  }
}
