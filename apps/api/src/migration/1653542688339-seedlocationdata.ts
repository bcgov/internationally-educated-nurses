import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seedlocationdata1653542688334 implements MigrationInterface {
  name = 'seedlocationdata1653542688334';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM public.ien_applicant_jobs_job_location_ien_job_locations WHERE ien_job_locations_id > 84`,
    );
    await queryRunner.query(`DELETE FROM public.ien_job_locations WHERE id > 84`);
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (1, '100 Mile House') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (2, 'Abbotsford') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (3, 'Agassiz-Harrison') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (4, 'Alberni-Clayoquot') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (5, 'Armstrong-Spallumcheen') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (6, 'Arrow Lakes') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (7, 'Bella Coola Valley') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (8, 'Burnaby') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (9, 'Burns Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (10, 'Cariboo-Chilcotin') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (11, 'Castlegar') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (12, 'Central Coast') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (13, 'Central Okanagan') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (14, 'Chilliwack') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (15, 'Comox Valley') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (16, 'Cowichan Valley North') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (17, 'Cowichan Valley South') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (18, 'Cowichan Valley West') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (19, 'Cranbrook') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (20, 'Creston') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (21, 'Delta') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (22, 'Enderby') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (23, 'Fernie') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (24, 'Fort Nelson') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (25, 'Golden') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (26, 'Grand Forks') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (27, 'Greater Campbell River') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (28, 'Greater Nanaimo') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (29, 'Greater Victoria') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (30, 'Haida Gwaii') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (31, 'Hope') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (32, 'Howe Sound') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (33, 'Kamloops') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (34, 'Keremeos') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (35, 'Kettle Valley') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (36, 'Kimberley') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (37, 'Kitimat') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (38, 'Kootenay Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (39, 'Langley') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (40, 'Lillooet') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (41, 'Maple Ridge-Pitt Meadows') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (42, 'Merritt') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (43, 'Mission') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (44, 'Nechako') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (45, 'Nelson') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (46, 'New Westminster') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (47, 'Nisga''a') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (48, 'North Thompson') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (49, 'North Vancouver') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (50, 'Oceanside') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (51, 'Peace River North') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (52, 'Peace River South') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (53, 'Penticton') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (54, 'Powell River') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (55, 'Prince George') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (56, 'Prince Rupert') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (57, 'Princeton') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (58, 'Quesnel') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (59, 'Revelstoke') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (60, 'Richmond') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (61, 'Saanich Peninsula') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (62, 'Salmon Arm') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (63, 'Smithers') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (64, 'Snow Country') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (65, 'South Cariboo') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (66, 'South Surrey-White Rock') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (67, 'Southern Gulf Islands') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (68, 'Southern Okanagan') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (69, 'Stikine') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (70, 'Summerland') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (71, 'Sunshine Coast') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (72, 'Surrey') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (73, 'Telegraph Creek') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (74, 'Terrace') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (75, 'Trail') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (76, 'Tri-Cities') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (77, 'Upper Skeena') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (78, 'Vancouver') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (79, 'Vancouver Island North') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (80, 'Vancouver Island West') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (81, 'Vernon') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (82, 'West Vancouver-Bowen Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (83, 'Western Communities') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      INSERT INTO public.ien_job_locations(id, title) VALUES (84, 'Windermere') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM public.ien_job_locations WHERE id <= 84`);
  }
}
