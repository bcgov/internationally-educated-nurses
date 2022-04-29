import { MigrationInterface, QueryRunner } from 'typeorm';

export class Updateseeddata1651041828909 implements MigrationInterface {
  name = 'updateseeddata1651041828909';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (101, 'Registered for HMBC services', 'HMBC', 10001) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (102, 'Profile Complete', 'HMBC', 10001) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (201, 'Applied to NNAS', 'Candidate', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (202, 'Documents Submitted (NNAS Application in Review)', 'Candidate', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (203, 'Received NNAS Report', 'Candidate', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (204, 'Applied to BCCNM', 'Candidate', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (205, 'Completed English Language Requirement*', 'Candidate', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (206, 'Referred to NCAS*', 'Candidate', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (207, 'Completed Computer-Based Assessment (CBA)*', 'Candidate', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (208, 'Completed Oral Assessment (OA) and Simulation Lab Assessment (SLA)*', 'Candidate', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (209, 'Completed NCAS*', 'Candidate', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (210, 'Referred to Additional Education*', 'Candidate', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (211, 'Completed Additional Education*', 'Candidate', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (212, 'Referred to NCLEX*', 'Candidate', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (213, 'Eligible for Provisional Licensure*', 'Candidate', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (214, 'NCLEX - Written', 'Candidate', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (215, 'NCLEX - Passed ', 'Candidate', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (216, 'BCCNM Licensed - Full License', 'Candidate', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (401, 'First Steps Document Sent', 'HMBC', 10004) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (402, 'Documents sent to HMBC', 'HA', 10004) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (403, 'Application Submitted to BC PNP', 'Candidate', 10004) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (404, 'Confirmation of Nomination Received', 'Candidate', 10004) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (405, 'Second Steps Sent', 'HMBC', 10004) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (406, 'Work Permit Application Submitted *', 'Candidate', 10004) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (407, 'Work Permit Approval Letter Received *', 'Candidate', 10004) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (408, 'Arrival in Canada - Work Permit Received', 'Candidate', 10004) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party, parent_id) VALUES (409, 'Permanent Residency', 'Candidate', 10004) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, party,  parent_id) VALUES (501, 'Candidate started job', 'HA', 10005) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id, party = EXCLUDED.party;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM public.ien_applicant_status WHERE id IN (101, 102, 501) OR id BETWEEN 201 AND 216 OR id BETWEEN 401 AND 408`,
    );
  }
}
