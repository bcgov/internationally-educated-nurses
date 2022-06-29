import {MigrationInterface, QueryRunner} from "typeorm";

export class converEmailColumToUnique1656503287019 implements MigrationInterface {
    name = 'converEmailColumToUnique1656503287019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7af59f366e76c74a2dd999a499" ON "ien_users" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_7af59f366e76c74a2dd999a499"`);
    }

}
