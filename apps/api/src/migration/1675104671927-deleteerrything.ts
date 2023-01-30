import { MigrationInterface, QueryRunner } from "typeorm"

export class deleteerrything1675104671927 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE USERS');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
