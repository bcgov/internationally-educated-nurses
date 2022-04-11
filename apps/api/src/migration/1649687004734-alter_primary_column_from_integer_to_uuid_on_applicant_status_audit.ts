import {MigrationInterface, QueryRunner} from "typeorm";

export class alterPrimaryColumnFromIntegerToUuidOnApplicantStatusAudit1649687004734 implements MigrationInterface {
    name = 'alterPrimaryColumnFromIntegerToUuidOnApplicantStatusAudit1649687004734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT "PK_da37e46c4475ec772047add45a2"`);
        await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" ADD CONSTRAINT "PK_da37e46c4475ec772047add45a2" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT "PK_da37e46c4475ec772047add45a2"`);
        await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" ADD "id" BIGSERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" ADD CONSTRAINT "PK_da37e46c4475ec772047add45a2" PRIMARY KEY ("id")`);
    }

}
