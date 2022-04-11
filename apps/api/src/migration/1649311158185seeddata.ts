import { MigrationInterface, QueryRunner } from 'typeorm';

export class seeddata1649137089845c implements MigrationInterface {
  name = 'seeddata1649311158185';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (1,'Surrey Memorial Hospital') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (2,'Zeballos') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (3,'100 Mile House') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (4,'Abbotsford') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (5,'Agassiz and Harrison') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (6,'Ahousat') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (7,'Aldergrove') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (8,'Alert Bay') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (9,'Alexandria') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (10,'Alexis Creek') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (11,'Alice Arm - Kitsault') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (12,'Anahim Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (13,'Anmore') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (14,'Argenta') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (15,'Armstrong') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (16,'Ashcroft') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (17,'Atlin') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (18,'Avola') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (19,'Balfour') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (20,'Bamfield') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (21,'Barkerville') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (22,'Barnston Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (23,'Barriere') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (24,'Beaverdell') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (25,'Belcarra') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (26,'Bell II') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (27,'Bella Bella') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (28,'Bella Coola') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (29,'Big White') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (30,'Blind Bay') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (31,'Blue River') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (32,'Blueberry River') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (33,'Boston Bar') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (34,'Boswell') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (35,'Bowen Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (36,'Bralorne') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (37,'Bridesville') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (38,'Bridge Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (39,'Britannia Beach') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (40,'Broman Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (41,'Burnaby') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (42,'Burns Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (43,'Cache Creek') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (44,'Campbell River') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (45,'Canal Flats') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (46,'Canim Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (47,'Cassiar') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (48,'Cassidy') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (49,'Castlegar') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (50,'Cawston') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (51,'Cedar') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (52,'Central Saanich') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (53,'Chase') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (54,'Chemainus') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (55,'Cherryville') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (56,'Cheslatta') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (57,'Chetwynd') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (58,'Chilanko Forks') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (59,'Chilliwack') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (60,'Christina Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (61,'Clearwater') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (62,'Clinton') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (63,'Cloverdale') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (64,'Coalmont') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (65,'Cobble Hill') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (66,'Coldstream') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (67,'Colwood') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (68,'Comox') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (69,'Coombs') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (70,'Coquitlam') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (71,'Cortes Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (72,'Courtenay') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (73,'Cowichan Bay') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (74,'Craigellachie') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (75,'Cranbrook') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (76,'Crawford Bay') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (77,'Crescent Valley') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (78,'Creston') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (79,'Crofton') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (80,'Cultus Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (81,'Cumberland') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (82,'D''Arcy') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (83,'Dawson Creek') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (84,'Dease Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (85,'Deep Cove') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (86,'Deer Park') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (87,'Delta') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (88,'Denman Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (89,'Deroche') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (90,'Dog Creek') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (91,'Doig River') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (92,'Duncan') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (93,'Edgewood') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (94,'Egmont') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (95,'Elkford') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (96,'Endako') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (97,'Enderby') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (98,'Esquimalt') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (99,'Falkland') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (100,'Fanny Bay') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (101,'Fauquier') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (102,'Fernie') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (103,'Field') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (104,'Fort Babine') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (105,'Fort Fraser') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (106,'Fort Langley') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (107,'Fort Nelson') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (108,'Fort St. James') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (109,'Fort St. John') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (110,'Fort Ware') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (111,'Francois Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (112,'Fraser Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (113,'Fruitvale') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (114,'Gabriola Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (115,'Galiano Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (116,'Gambier Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (117,'Gibsons') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (118,'Gilford Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (119,'Glade') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (120,'Gold Bridge') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (121,'Gold River') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (122,'Golden') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (123,'Grand Forks') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (124,'Granisle') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (125,'Grasmere') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (126,'Grassy Plains') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (127,'Greenville') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (128,'Greenwood') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (129,'Halfmoon Bay') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (130,'Halfway River') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (131,'Hanceville') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (132,'Harrison Hot Springs') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (133,'Harrop-Procter') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (134,'Hartley Bay') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (135,'Hazelton') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (136,'Hedley') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (137,'Highlands') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (138,'Hills') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (139,'Holberg') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (140,'Hope') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (141,'Hornby Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (142,'Horsefly') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (143,'Horseshoe Bay') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (144,'Hot Springs Cove') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (145,'Houston') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (146,'Howser') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (147,'Hudson''s Hope') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (148,'Invermere') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (149,'Iskut') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (150,'Jade City') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (151,'Jaffray') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (152,'Johnsons Landing') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (153,'Jordan River') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (154,'Kaleden') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (155,'Kamloops') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (156,'Kaslo') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (157,'Keats Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (158,'Kelowna') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (159,'Kent-Agassiz') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (160,'Keremeos') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (161,'Kimberley') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (162,'Kincolith') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (163,'Kingcome') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (164,'Kitimat') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (165,'Kitkatla') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (166,'Kitsault') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (167,'Kitwancool') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (168,'Kitwanga') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (169,'Kleena Kleene') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (170,'Klemtu') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (171,'Kootenay Bay') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (172,'Kwadacha Fort Ware') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (173,'Kyuquot') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (174,'Ladner') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (175,'Ladysmith') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (176,'Lake Babine') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (177,'Lake Country') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (178,'Lake Cowichan') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (179,'Langara Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (180,'Langford') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (181,'Langley') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (182,'Langley Township') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (183,'Lantzville') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (184,'Lasqueti Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (185,'Lavington') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (186,'Liard River') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (187,'Likely') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (188,'Lillooet') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (189,'Lions Bay') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (190,'Little Fort') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (191,'Logan Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (192,'Lone Butte') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (193,'Lower Post') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (194,'Lumby') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (195,'Lund') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (196,'Lytton') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (197,'Mackenzie') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (198,'Madeira Park') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (199,'Malakwa') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (200,'Maple Ridge') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (201,'Masset') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (202,'Mayne Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (203,'McBride') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (204,'McLeese Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (205,'McLeod Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (206,'Meadow Creek') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (207,'Merritt') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (208,'Mesachie Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (209,'Metchosin') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (210,'Metlakatla') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (211,'Meziadin Junction') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (212,'Mica Creek') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (213,'Midway') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (214,'Mill Bay') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (215,'Miocene') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (216,'Mission') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (217,'Moberly Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (218,'Montrose') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (219,'Moricetown') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (220,'Mount Currie') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (221,'Moyie') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (222,'Muncho Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (223,'Nadleh') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (224,'Nakusp') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (225,'Nanaimo') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (226,'Naramata') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (227,'Nass Valley') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (228,'Nazko') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (229,'Needles') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (230,'Nelson') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (231,'Nemaiah Valley') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (232,'New Aiyansh') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (233,'New Denver') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (234,'New Westminster') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (235,'Nitinat') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (236,'North Bend') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (237,'North Cowichan') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (238,'North Saanich') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (239,'North Vancouver') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (240,'North Vancouver District') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (241,'Oak Bay') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (242,'Ocean Falls') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (243,'Okanagan Falls') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (244,'Oliver') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (245,'Osoyoos') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (246,'Oyster River') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (247,'Parksville') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (248,'Pavillion') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (249,'Peachland') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (250,'Pemberton') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (251,'Pender Harbour') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (252,'Pender Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (253,'Penelakut Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (254,'Penticton') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (255,'Pink Mountain') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (256,'Pitt Meadows') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (257,'Popkum') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (258,'Port Alberni') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (259,'Port Alice') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (260,'Port Clements') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (261,'Port Coquitlam') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (262,'Port Edward') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (263,'Port Hardy') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (264,'Port McNeill') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (265,'Port Moody') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (266,'Port Renfrew') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (267,'Port Simpson') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (268,'Pouce Coupe') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (269,'Powell River') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (270,'Prince George') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (271,'Prince Rupert') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (272,'Princeton') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (273,'Prophet River') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (274,'Quadra Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (275,'Qualicum Beach') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (276,'Quatsino') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (277,'Queen Charlotte') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (278,'Quesnel') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (279,'Radium Hot Springs') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (280,'Redsone Reserve') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (281,'Revelstoke') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (282,'Richmond') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (283,'Riondel') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (284,'Riske Creek') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (285,'Rivers Inlet') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (286,'Roberts Creek') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (287,'Rock Creek') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (288,'Rosedale') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (289,'Rossland') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (290,'Rosswood') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (291,'Royston') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (292,'Saanich') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (293,'Saanichton') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (294,'Salmo') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (295,'Salmon Arm') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (296,'Salt Spring Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (297,'Samahquam') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (298,'Sandon') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (299,'Sandspit') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (300,'Saturna Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (301,'Savary Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (302,'Savona') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (303,'Sayward') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (304,'Scotch Creek') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (305,'Sechelt') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (306,'Seton Portage') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (307,'Shawnigan Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (308,'Sicamous') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (309,'Sidney') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (310,'Silverton') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (311,'Sirdar') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (312,'Skatin') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (313,'Skidegate') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (314,'Slocan Park') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (315,'Smithers') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (316,'Sointula') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (317,'Sooke') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (318,'Sorrento') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (319,'Spallumcheen') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (320,'Sparwood') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (321,'Spences Bridge') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (322,'Squamish') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (323,'Stewart') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (324,'Summerland') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (325,'Sun Peaks') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (326,'Surrey') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (327,'Tahsis') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (328,'Takla Landing') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (329,'Tatla Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (330,'Tatlayoko Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (331,'Taylor') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (332,'Telegraph Creek') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (333,'Telkwa') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (334,'Terrace') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (335,'Tête Jaune Cache') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (336,'Texada Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (337,'Thetis Island') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (338,'Tipella') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (339,'Tlell') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (340,'Tofino') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (341,'Topley') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (342,'Trail') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (343,'Tranquille') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (344,'Trout Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (345,'Tsawwassen') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (346,'Tsay Keh Dene') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (347,'Tulameen') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (348,'Tumbler Ridge') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (349,'Ucluelet') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (350,'Union Bay') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (351,'Usk') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (352,'Valemount') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (353,'Vancouver') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (354,'Vanderhoof') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (355,'Vaseux Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (356,'Vavenby') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (357,'Vernon') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (358,'Victoria') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (359,'View Royal') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (360,'Wardner') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (361,'Warfield') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (362,'Wasa') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (363,'Wells') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (364,'West Kelowna') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (365,'West Vancouver') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (366,'Westbank') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (367,'Westbridge') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (368,'Whistler') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (369,'White Rock') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (370,'Williams Lake') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (371,'Wilson Creek') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (372,'Windermere') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (373,'Winlaw') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (374,'Winter Harbour') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (375,'Woodfibre') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (376,'Woss') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (377,'Yahk') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (378,'Yale') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_locations(id, title) VALUES (379,'Ymir') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (1,'Nursing practitioner') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (2,'Nursing practitioner') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (3,'Aboriginal Health Nursing') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (4,'Administration') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (5,'Advanced Practice') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (6,'Ambulatory Care') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (7,'Cardiology - CCU/Telemetry') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (8,'Chronic Disease/Diabetes') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (9,'Clinical Educator') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (10,'Clinical Coordinator') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (11,'Clinical Nurse Leader') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (12,'Communicable Disease Control') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (13,'Community Health') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (14,'Critical Care/ICU') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (15,'Critical Care/Transport') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (16,'Education') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (17,'Emergency Room/Trauma') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (18,'Family Practice') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (19,'Geriatrics/Gerontology') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (20,'Home Care') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (21,'Infection Control') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (22,'Management') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (23,'Maternity (Antepartum & Postpartum)') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (24,'Maternity (Labour & Delivery)') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (25,'Medicine/Surgery') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (26,'Midwifery') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (27,'Neonatal Intensive Care') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (28,'Neurology') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (29,'New Graduate') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (30,'Nurse Executive') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (31,'Occupational Health') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (32,'Oncology') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (33,'Operating Room (Adult)') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (34,'Operating Room (Pediatric)') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (35,'Outreach') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (36,'Palliative Care') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (37,'Pediatrics') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (38,'Post Anesthetic Recovery') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (39,'Primary Care Clinic') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (40,'Psychiatry/Mental Health') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (41,'Public Health') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (42,'Rehabilitation') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (43,'Rehabilitation/Spinal Unit') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (44,'Renal Dialysis') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (45,'Research') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (46,'Still in School') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (47,'Transitional Care Nurse') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_job_titles(id,title) VALUES (48,'Wound Care') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id,status) VALUES (10001,'IEN HMBC Process') ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id,status) VALUES (10002,'IEN Licensing/Registration') ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id,status) VALUES (10003,'IEN Recruitment (once licensed)') ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id,status) VALUES (10004,'BC PNP (once job offer obtained and if immigration required)') ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id,status) VALUES (10005,'Final Milestone') ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (101, 'HMBC - Registered for HMBC services', 10001) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (102, 'HMBC - Profile Complete', 10001) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (201, 'Candidate - Applied to NNAS', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (202, 'Candidate - Documents Submitted (NNAS Application in Review)', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (203, 'Candidate - Received NNAS Report', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (204, 'Candidate - Applied to BCCNM', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (205, 'Candidate - Completed English Language Requirement*', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (206, 'Candidate - Referred to NCAS*', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (207, 'Candidate - Completed Computer-Based Assessment (CBA)*', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (208, 'Candidate - Completed Oral Assessment (OA) and Simulation Lab Assessment (SLA)*', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (209, 'Candidate - Completed NCAS*', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (210, 'Candidate - Referred to Additional Education*', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (211, 'Candidate - Completed Additional Education*', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (212, 'Candidate - Referred to NCLEX*', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (213, 'Candidate - Eligible for Provisional Licensure*', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (214, 'Candidate - NCLEX - Written', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (215, 'Candidate - NCLEX - Passed ', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (216, 'Candidate - BCCNM Licensed - Full License', 10002) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (301, 'Prescreen completed', 10003) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (302, 'Interview completed', 10003) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (303, 'References completed', 10003) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (304, 'Offered position', 10003) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (305, 'Candidate withdrew', 10003) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (306, 'Candidate was unresponsive', 10003) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (307, 'Candidate was not selected ', 10003) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (308, 'Candidate accepted the job offer', 10003) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (401, 'HMBC - First Steps Document Sent', 10004) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (402, 'HA - Documents sent to HMBC', 10004) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (403, 'Candidate - Application Submitted to BC PNP', 10004) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (404, 'Candidate - Confirmation of Nomination Received', 10004) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (405, 'HMBC - Second Steps Sent', 10004) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (406, 'Candidate - Work Permit Application Submitted *', 10004) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (407, 'Candidate - Work Permit Approval Letter Received *', 10004) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (408, 'Candidate - Arrival in Canada - Work Permit Received', 10004) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (409, 'Candidate - Permanent Residency', 10004) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_applicant_status(id, status, parent_id) VALUES (501, 'HA - Candidate started job', 10005) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, parent_id = EXCLUDED.parent_id;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_users(id, name) VALUES (1, 'Chadi') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_users(id, name) VALUES (2, 'Nicole') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_ha_pcn(id, title, abbreviation) VALUES (1, 'Fraser Health Authority', 'FHA') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, abbreviation = EXCLUDED.abbreviation;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_ha_pcn(id, title, abbreviation) VALUES (2, 'Interior Health Authority', 'IHA') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, abbreviation = EXCLUDED.abbreviation;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_ha_pcn(id, title, abbreviation) VALUES (3, 'Northern Health Authority', 'NHA') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, abbreviation = EXCLUDED.abbreviation;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_ha_pcn(id, title, abbreviation) VALUES (4, 'Vancouver Island Health Authority', 'VIHA') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, abbreviation = EXCLUDED.abbreviation;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_ha_pcn(id, title, abbreviation) VALUES (5, 'Vancouver Coastal Health Authority', 'VCHA') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, abbreviation = EXCLUDED.abbreviation;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_education(id, title) VALUES (1, 'Diploma/Certificate of Nursing') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_education(id, title) VALUES (2, 'Associate Degree of Nursing') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_education(id, title) VALUES (3, 'Bachelor of Nursing or Bachelor of Science in Nursing') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_education(id, title) VALUES (4, 'Master of Nursing') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_education(id, title) VALUES (5, 'Master of Nursing - Nurse Practitioner') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_education(id, title) VALUES (6, 'PhD') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
    await queryRunner.query(
      `INSERT INTO public.ien_education(id, title) VALUES (7, 'Combined Diploma/Degree in Midwifery & Nursing') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM public.ien_job_locations WHERE id BETWEEN 1 and 379`);
    await queryRunner.query(`DELETE FROM public.ien_job_titles WHERE id BETWEEN 1 and 48`);
    await queryRunner.query(
      `DELETE FROM public.ien_applicant_status WHERE id IN (101, 102, 501) OR id BETWEEN 201 AND 216 OR id BETWEEN 301 AND 308 OR id BETWEEN 401 AND 408`,
    );
    await queryRunner.query(
      `DELETE FROM public.ien_applicant_status WHERE id IN (10001, 10002, 10003, 10004, 10005)`,
    );
    await queryRunner.query(`DELETE FROM public.ien_ha_pcn WHERE id BETWEEN 1 and 5`);
    await queryRunner.query(`DELETE FROM public.ien_users WHERE id BETWEEN 1 and 2`);
    await queryRunner.query(`DELETE FROM public.ien_education WHERE id BETWEEN 1 and 7`);
  }
}
