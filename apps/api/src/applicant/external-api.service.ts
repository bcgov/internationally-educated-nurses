/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IsNull,
  Not,
  Repository,
  FindManyOptions,
  ObjectLiteral,
  SelectQueryBuilder,
  getManager,
  EntityManager,
  In,
  ILike,
} from 'typeorm';
import dayjs from 'dayjs';
import _ from 'lodash';
import { AtsApplicant, Authorities, STATUS, StatusCategory } from '@ien/common';
import { ExternalRequest } from 'src/common/external-request';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicant } from './entity/ienapplicant.entity';
import { IENApplicantStatusAudit } from './entity/ienapplicant-status-audit.entity';
import { IENApplicantUtilService } from './ienapplicant.util.service';
import { SyncApplicantsAudit } from './entity/sync-applicants-audit.entity';
import { IENMasterService } from './ien-master.service';
import { IENUsers } from './entity/ienusers.entity';
import { IENUserFilterAPIDTO, SyncApplicantsResultDTO } from './dto';
import { IENHaPcn } from './entity/ienhapcn.entity';
import { IENStatusReason } from './entity/ienstatus-reason.entity';
import { IENJobTitle } from './entity/ienjobtitles.entity';
import { IENApplicantStatus } from './entity/ienapplicant-status.entity';
import { ApplicantSyncRO, MilestoneSync } from './ro/sync.ro';
import { isNewBCCNMProcess } from 'src/common/util';

@Injectable()
export class ExternalAPIService {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @Inject(ExternalRequest) private readonly external_request: ExternalRequest,
    @Inject(IENApplicantUtilService)
    private readonly ienapplicantUtilService: IENApplicantUtilService,
    @Inject(IENMasterService)
    private readonly ienMasterService: IENMasterService,
    @InjectRepository(IENApplicant)
    private readonly ienapplicantRepository: Repository<IENApplicant>,
    @InjectRepository(IENApplicantStatus)
    private readonly ienapplicantStatusRepository: Repository<IENApplicantStatus>,
    @InjectRepository(IENApplicantStatusAudit)
    private readonly ienapplicantStatusAuditRepository: Repository<IENApplicantStatusAudit>,
    @InjectRepository(SyncApplicantsAudit)
    private readonly syncApplicantsAuditRepository: Repository<SyncApplicantsAudit>,
  ) {}

  /**
   * Save all data for master tables.
   */
  async saveData(): Promise<void> {
    if (!process.env.HMBC_ATS_AUTH_KEY || !process.env.HMBC_ATS_BASE_URL) {
      throw new InternalServerErrorException('ATS endpoint is not set.');
    }
    this.logger.log(`Using ATS : ${process.env.HMBC_ATS_BASE_URL}`, 'ATS-SYNC');

    const manager = getManager();
    await manager.queryRunner?.startTransaction();

    try {
      await this.saveHa(manager);
      await this.saveUsers(manager);
      await this.saveReasons(manager);
      await this.saveMilestones(manager);

      await manager.queryRunner?.commitTransaction();
      this.logger.log(`Master tables imported at ${new Date()}`, 'ATS-SYNC');
    } catch (e) {
      await manager.queryRunner?.rollbackTransaction();
      throw e;
    }
  }

  /**
   * Collect HealthAuthorities data from <domain>/HealthAuthority Url.
   * and Save in ien_ha_pcn table in database for applicant reference.
   */
  async saveHa(manager: EntityManager): Promise<void> {
    const data = await this.external_request.getHa();
    if (data.length && Array.isArray(data)) {
      const listHa = data.map(item => ({ ...item, title: item.name }));
      const result = await manager.upsert(IENHaPcn, listHa, ['id']);
      this.logger.log(`${result?.raw?.length}/${listHa?.length} authorities updated`, 'ATS-SYNC');
    } else {
      this.logger.log(`No data for Health Authorities found, skipping.`);
    }
  }

  /**
   * Collect Staff/User data from <domain>/staff Url.
   * and Save in ien_users table in database for applicant reference.
   */
  async saveUsers(manager: EntityManager): Promise<void> {
    const data = await this.external_request.getStaff();
    if (data?.length && Array.isArray(data)) {
      const listUsers = data.map(item => {
        return {
          user_id: item.id.toLowerCase(),
          name: item.name,
          email: item.email,
        };
      });
      const result = await manager.upsert(IENUsers, listUsers, ['email']);

      this.logger.log(`${result?.raw?.length || 0}/${data.length} users updated`, 'ATS-SYNC');
    } else {
      this.logger.log('No user data found, skipping.');
    }
  }

  /**
   * Collect Milestone reason data from <domain>/Reason Url.
   * and Save in ien_status_reasons table in database for milestone/status reference.
   */
  async saveReasons(manager: EntityManager): Promise<void> {
    const data = await this.external_request.getReason();
    if (data.length && Array.isArray(data)) {
      const result = await manager.upsert(IENStatusReason, data, ['id']);
      this.logger.log(`${result?.raw?.length || 0}/${data.length} reasons updated`, 'ATS-SYNC');
    } else {
      this.logger.log('No Reasons found, skipping.');
    }
  }

  /**
   * @deprecated ATS doesn't support /specialty-departments
   *
   * Collect Job-competition department data from <domain>/department Url.
   * and Save in ien_job_titles table in database for department reference.
   */
  async saveDepartments(manager: EntityManager): Promise<void> {
    const data = await this.external_request.getDepartment();
    if (Array.isArray(data)) {
      const departments = data.map(item => {
        return {
          id: item.id,
          title: item.name,
        };
      });
      const result = await manager.upsert(IENJobTitle, departments, ['id']);
      this.logger.log(`${result?.raw?.length || 0}/${data.length} departments updated`, 'ATS-SYNC');
    }
  }

  /**
   * Let's clean and map status/milestone object with existing schema
   * and upsert it.
   */
  async saveMilestones(manager: EntityManager): Promise<void> {
    const data = await this.external_request.getMilestone();

    if (data.length && Array.isArray(data)) {
      const result = await manager.upsert(
        IENApplicantStatus,
        data.map(row => ({ ...row, status: row.name })), // name -> status
        ['id'],
      );
      this.logger.log(`${result?.raw?.length || 0}/${data.length} milestones updated`, 'ATS-SYNC');
    } else {
      this.logger.log(`No milestones found, skipping.`);
    }
  }

  createParallelRequestRun(input: {
    parallel_requests: number;
    per_page: number;
    offset: number;
    from_date?: string | null;
    to_date?: string | null;
  }) {
    const { parallel_requests, per_page, from_date, to_date } = input;
    let { offset } = input;
    const pages = [];

    for (let i = 0; i < parallel_requests; i++) {
      pages.push(
        this.external_request.getApplicants(
          `/applicants?next=${per_page}&offset=${offset}&from=${from_date}&to=${to_date}`,
        ),
      );
      offset += per_page;
    }
    return pages;
  }

  async fetchApplicantsFromATS(from: string, to: string) {
    const parallel_requests = 5;

    const per_page = 50;
    let offset = 0;
    let is_next = true;
    let pages: any = [];
    let newData: AtsApplicant[] = [];

    /**
     * Here we do not have the total page count and the total number of records that we have to fetch.
     * We will run ${parallel_requests} numbers parallel requests. It helps o reduce fetch time.
     * The higher number of records per page does not perform well due to external server limitations.
     * So set up a few default values like five(5) pages and 50 records per page simultaneously.
     * A developer responsible for an external API on HMBC ATS data has verified these parameters' values.
     */
    while (is_next) {
      is_next = false; // It will set true if next page is available.
      const input = {
        parallel_requests,
        per_page,
        offset,
        from,
        to,
      };
      pages = pages.concat(this.createParallelRequestRun(input));
      let temp: any[] = [];
      await Promise.all(pages).then(res => {
        res.forEach(r => {
          temp = temp.concat(r);
        });
      });
      this.logger.log(`received ${temp.length} applicants`, 'ATS-SYNC');
      // let's check if next pages are available
      if (temp.length >= parallel_requests * per_page) {
        is_next = true;
        offset += parallel_requests * per_page;
      }
      // Cleanup & set data for the next iteration
      newData = newData.concat(temp);
      temp = [];
      pages = [];
    }
    return newData;
  }

  /**
   * fetch and upsert applicant details
   */
  async saveApplicant(from: string, to?: string): Promise<SyncApplicantsResultDTO | undefined> {
    /**
     * We want to sync yesterday's data on everyday basis
     * On daily basis we will use auto generated from and to date
     * If we pass from-to date, It will sync data between given dates.
     * That helps to import data on any environment and correct past data anytime.
     */
    let from_date = from;
    if (!from_date) {
      // Fetch last successful run, to make sure we are not missing any data to sync due to external server failure
      const lastSync = await this.getLatestSuccessfulSync();
      from_date = lastSync.length ? dayjs(lastSync[0].updated_date).format('YYYY-MM-DD') : '';
    }
    if (!from_date) {
      from_date = dayjs().add(-1, 'day').format('YYYY-MM-DD'); // yesterday
    }

    const to_date = to || dayjs().format('YYYY-MM-DD');

    if (dayjs(to_date).isBefore(from_date)) {
      throw new BadRequestException(
        `'to' (${to_date}) falls before 'from' (${from_date}) : 'from' date must come before 'to' date.`,
      );
    }

    const audit = await this.saveSyncApplicantsAudit();

    try {
      let applicants = await this.fetchApplicantsFromATS(from_date, to_date);

      applicants = await this.filterContradictoryRows(applicants);

      const result = await getManager().transaction(async manager => {
        const result = await this.createBulkApplicants(applicants, manager);
        result.milestones.removed = await this.removeMilestonesNotOnATS(applicants, manager);
        await this.saveSyncApplicantsAudit(audit.id, true, undefined, manager);
        return result;
      });
      return {
        from: from_date,
        to: to_date,
        result,
      };
    } catch (e: any) {
      await this.saveSyncApplicantsAudit(audit.id, false, { message: e.message, stack: e.stack });
      throw e;
    }
  }

  async saveSyncApplicantsAudit(
    id: number | undefined = undefined,
    is_success = false,
    additional_data: object | undefined | unknown = undefined,
    manager?: EntityManager,
  ): Promise<SyncApplicantsAudit> {
    if (id) {
      const audit = await this.syncApplicantsAuditRepository.findOne(id);
      if (audit) {
        audit.is_success = is_success;
        audit.additional_data = additional_data;
        manager
          ? await manager.save<SyncApplicantsAudit>(audit)
          : await this.syncApplicantsAuditRepository.save(audit);
        return audit;
      }
    }
    const addAuditData: object = {
      is_success,
      additional_data,
    };
    const newAudit = this.syncApplicantsAuditRepository.create(addAuditData);
    manager
      ? await manager.save<SyncApplicantsAudit>(newAudit)
      : await this.syncApplicantsAuditRepository.save(newAudit);
    return newAudit;
  }

  async getLatestSuccessfulSync(): Promise<SyncApplicantsAudit[]> {
    return this.syncApplicantsAuditRepository.find({
      where: { is_success: true },
      order: { updated_date: 'DESC' },
      take: 1,
    });
  }

  /**
   * fet user/staff and HA details to reduce database calls.
   * @returns
   */
  async getUsersMap() {
    // fetch user/staff details
    const users = await this.ienMasterService.ienUsersRepository.find({
      user_id: Not(IsNull()),
    });
    return _.keyBy(users, 'user_id');
  }

  async removeMilestonesNotOnATS(
    applicants: AtsApplicant[],
    manager: EntityManager,
  ): Promise<number> {
    let removedCount = 0;
    await Promise.all(
      applicants.map(async a => {
        const audits: { id: string; status_id: string }[] = await manager.query(`
          SELECT "audit"."id" id, "status"."id" status_id
          FROM "ien_applicant_status_audit" "audit"
          INNER JOIN "ien_applicant_status" "status" ON "status"."id" = "audit"."status_id"
          WHERE
            "audit"."applicant_id" = '${a.applicant_id.toLowerCase()}' AND
            "status"."category" != 'IEN Recruitment Process';
        `);

        if (!audits.length) return;

        const removed = audits.filter(
          ({ status_id }) => !a.milestones?.some(m => m.id.toLowerCase() === status_id),
        );
        if (removed.length > 0) {
          const result = await manager.delete<IENApplicantStatusAudit>(
            IENApplicantStatusAudit,
            removed.map(r => r.id),
          );
          removedCount += result.affected || 0;
        }
      }),
    );

    this.logger.log(`milestones deleted: ${removedCount}`, 'ATS-SYNC');
    return removedCount;
  }

  /**
   * Clean raw data and save applicant info into 'ien_applicant' table.
   * @param data Raw Applicant data
   * @param manager
   */
  async createBulkApplicants(data: AtsApplicant[], manager: EntityManager) {
    const result = {
      applicants: {
        total: data.length,
        processed: 0,
      },
      milestones: {
        total: 0,
        created: 0,
        updated: 0,
        dropped: 0,
        removed: 0,
      },
    };
    if (!data.length) {
      this.logger.log(`No applicants received today`);
      return result;
    }

    const applicants: any[] = await this.mapApplicants(data);

    const processed_applicant = await manager.upsert(IENApplicant, applicants, ['id']);
    result.applicants.processed = processed_applicant.raw.length;
    this.logger.log(`applicants synced: ${result.applicants.processed}/${data.length}`, 'ATS-SYNC');

    // Upsert milestones
    const { numOfMilestones, milestonesToBeInserted, milestonesToBeUpdated } =
      await this.mapMilestones(data);
    if (milestonesToBeUpdated?.length) {
      try {
        const result = await this.ienapplicantStatusAuditRepository.upsert(milestonesToBeUpdated, [
          'id',
        ]);
        this.logger.log(
          `Signed Return of Service Agreement milestones updated: ${result.raw.length}`,
          'ATS-SYNC',
        );
      } catch (e) {
        this.logger.error(e);
      }
    }
    if (milestonesToBeInserted.length) {
      try {
        const result = await manager
          .createQueryBuilder()
          .insert()
          .into(IENApplicantStatusAudit)
          .values(milestonesToBeInserted)
          .orIgnore(true)
          .execute();
        this.logger.log(`milestones updated: ${result?.raw?.length || 0}`, 'ATS-SYNC');
      } catch (e) {
        this.logger.error(e);
      }
    }

    // update applicant with the latest status
    const mappedApplicantList = processed_applicant?.raw.map((item: { id: string }) => item.id);
    await this.ienapplicantUtilService.updateLatestStatusOnApplicant(mappedApplicantList, manager);

    const dropped = numOfMilestones - milestonesToBeInserted.length - milestonesToBeUpdated.length;
    result.milestones = {
      total: numOfMilestones,
      created: milestonesToBeInserted.length,
      updated: milestonesToBeUpdated.length,
      dropped,
      removed: 0,
    };

    if (dropped) {
      this.logger.log(`milestones dropped: ${dropped}/${numOfMilestones}`, 'ATS-SYNC');
    }

    return result;
  }

  /**
   * Map raw data with existing applicant schema
   * @param data raw applicant data
   * @returns object that use in upsert applicants
   */
  async mapApplicants(data: AtsApplicant[]) {
    const users = await this.getUsersMap();
    return data.map(a => {
      let assigned_to = null;

      a.new_bccnm_process = isNewBCCNMProcess(a.registration_date);

      if (Array.isArray(a.assigned_to)) {
        assigned_to = a.assigned_to.map((user: { name: string; id: string }) => {
          user.name = users[user.id.toLowerCase()]?.name;
          return user;
        });
      } else if (a.assigned_to) {
        const user: { id: string; name: string } = a.assigned_to;
        assigned_to = {
          ...user,
          name: user.id ? users[user.id?.toLowerCase()] : '',
        };
      }

      let citizenship;
      if (a.countries_of_citizenship && Array.isArray(a.countries_of_citizenship)) {
        citizenship = a.countries_of_citizenship;
      } else {
        citizenship = a.countries_of_citizenship ? [a.countries_of_citizenship] : null;
      }

      return {
        id: a.applicant_id.toLowerCase(),
        ats1_id: a.ats1_id.toString(),
        name: `${a.first_name} ${a.last_name}`,
        email_address: a.email_address,
        phone_number: a.phone_number,
        registration_date: new Date(a.registration_date),
        country_of_citizenship: citizenship,
        country_of_residence: a?.country_of_residence,
        new_bccnm_process: a?.new_bccnm_process,
        bccnm_license_number: a?.bccnm_license_number,
        pr_status: a?.pr_status,
        nursing_educations: a?.nursing_educations,
        notes: a?.notes,
        assigned_to,
        pathway: a.pathway_id,
        additional_data: {
          first_name: a.first_name,
          last_name: a.last_name,
        },
        created_date: a.created_date,
        updated_date: a.updated_date,
      };
    });
  }
  /**
   * Jan 2024 - This function fixes an issue caused by the sync in production. There are at least one applicant that have an ats1_id already in use by another applicant.
   * This is causing an
   * @param applicants - List of incoming applicants from ATS
   * @returns A filtered list of applicants that will not cause a violation of the unique key constraint for the ats1_id
   */
  async filterContradictoryRows(applicants: AtsApplicant[]) {
    const existingApplicants: IENApplicant[] = await this.ienapplicantRepository.find({});
    const contradictions: unknown[] = [];
    const filteredApplicants = applicants.filter(applicant => {
      const contradiction = existingApplicants.find(
        existingApplicant =>
          existingApplicant.ats1_id === applicant.ats1_id.toString() &&
          existingApplicant.id !== applicant.applicant_id,
      );
      if (contradiction) {
        contradictions.push(contradiction);
        return false;
      } else {
        return true;
      }
    });
    if (contradictions.length) {
      this.logger.log(contradictions);
    }
    return filteredApplicants;
  }
  /**
   * We need to ignore all the recruiment related milestone for now
   */
  async allowedMilestonesMap(): Promise<_.Dictionary<IENApplicantStatus>> {
    const milestones = await this.ienMasterService.ienApplicantStatusRepository.find({
      where: {
        category: Not(StatusCategory.RECRUITMENT),
      },
    });
    return _.keyBy(milestones, 'id');
  }

  async getReasonsMap() {
    const reasons = await this.ienMasterService.ienStatusReasonRepository.find();
    return _.keyBy(reasons, 'id');
  }

  /**
   *
   * @param applicants raw applicant data
   * @returns object that use in upsert milestone/status
   */
  async mapMilestones(applicants: AtsApplicant[]) {
    const users = await this.getUsersMap();
    const allowedMilestones = await this.allowedMilestonesMap();

    let numOfMilestones = 0;
    const validMilestones = _.flatten(
      applicants.map(applicant => {
        numOfMilestones += applicant.milestones?.length ?? 0;
        return this.getApplicantMilestonesFromATS(applicant, users, allowedMilestones);
      }),
    );

    if (numOfMilestones !== validMilestones.length) {
      this.logger.log(
        `milestones rejected: ${numOfMilestones - validMilestones.length}`,
        'ATS-SYNC',
      );
    }

    // To update ROS milestones created by spreadsheet, replace IDs
    const rosStatus = await this.ienapplicantStatusRepository.findOne({
      status: STATUS.SIGNED_ROS,
    });
    const rosMilestonesByATS = validMilestones.filter(m => m.status === rosStatus?.id);
    if (rosMilestonesByATS.length) {
      const rosMilestonesBySheet = await this.ienapplicantStatusAuditRepository.find({
        where: {
          status: rosStatus,
          notes: ILike('%Updated by BCCNM/NCAS%'),
          applicant: In(_.uniq(rosMilestonesByATS.map(m => m.applicant))),
        },
        relations: ['applicant'],
      });
      rosMilestonesByATS.forEach(m => {
        const current = rosMilestonesBySheet.find(e => e.applicant.id === m.applicant);
        if (current) {
          m.id = current.id;
          delete m.notes;
        }
      });
    }

    // exclude bccnm/ncas completion updated by spreadsheet
    const bccnmNcasStatuses = await this.ienapplicantStatusRepository.find({
      status: In([STATUS.APPLIED_TO_BCCNM, STATUS.COMPLETED_NCAS]),
    });
    const existingBccnmNcasMilestones = await this.ienapplicantStatusAuditRepository.find({
      where: {
        applicant: In(_.uniq(validMilestones.map(m => m.applicant))),
        status: In(bccnmNcasStatuses.map(({ id }) => id)),
        notes: ILike('%Updated by BCCNM/NCAS%'),
      },
      relations: ['applicant', 'status'],
    });
    const milestonesToBeInserted = validMilestones.filter(
      m =>
        m.status !== rosStatus?.id &&
        existingBccnmNcasMilestones.every(
          e => e.applicant.id !== m.applicant || m.status !== e.status.id,
        ),
    );

    const milestonesToBeUpdated = rosMilestonesByATS.filter(m => m.id);
    return { numOfMilestones, milestonesToBeInserted, milestonesToBeUpdated };
  }

  /** create applicant-milestone object */
  getApplicantMilestonesFromATS(
    applicant: AtsApplicant,
    users: _.Dictionary<IENUsers>,
    allowedMilestones: _.Dictionary<IENApplicantStatus>,
  ) {
    return (
      applicant.milestones
        ?.map(m => {
          if (allowedMilestones[m.id.toLowerCase()]) {
            const milestone: any = {
              status: m.id.toLowerCase(),
              applicant: applicant.applicant_id.toLowerCase(),
              notes: m.notes,
              start_date: m.start_date,
              created_date: m.created_date,
              updated_date: m.created_date,
            };
            if (m.added_by && users[m.added_by]) {
              milestone.added_by = users[m.added_by].id;
            }
            if (m.reason_id) {
              milestone.reason = m.reason_id.toLowerCase();
            }
            if (m.reason_other) {
              milestone.reason_other = m.reason_other;
            }
            if (m.effective_date) {
              milestone.effective_date = m.effective_date;
            }
            return milestone;
          } else {
            this.logger.log(`rejected milestone: ${m.id}`, 'ATS-SYNC');
          }
        })
        .filter(v => v) ?? []
    );
  }

  /**
   * get users for sync to ATS
   * @returns
   */
  async getUsers(filter: IENUserFilterAPIDTO): Promise<[data: IENUsers[], count: number]> {
    const { from, to, organization, limit, skip } = filter;

    const query: FindManyOptions<IENUsers> = {};

    if (limit) query.take = limit;
    if (skip) query.skip = skip;

    if (!from && !organization) {
      return this.ienMasterService.ienUsersRepository.findAndCount(query);
    }

    const conditions: (string | ObjectLiteral)[] = [];

    if (from) {
      const users_in_range = `created_date BETWEEN '${from}' AND '${
        to || new Date().toISOString().slice(0, 10)
      }'`;

      conditions.push(users_in_range);
    }

    if (organization) {
      // get email domain to check for based on acronym search param
      const domains = Authorities[organization]?.domains;

      const condition = domains?.map(n => `email LIKE '%${n}'`).join(' OR ');

      condition && conditions.push(`(${condition})`);
    }

    if (conditions.length > 0) {
      return this.ienMasterService.ienUsersRepository.findAndCount({
        where: (qb: SelectQueryBuilder<IENUsers>) => {
          const condition = conditions.shift();
          if (condition) qb.where(condition);
          conditions.forEach(c => qb.andWhere(c));
        },
        ...query,
      });
    } else {
      return this.ienMasterService.ienUsersRepository.findAndCount(query);
    }
  }

  async getApplicants(filter: IENUserFilterAPIDTO): Promise<ApplicantSyncRO[]> {
    const { from, to, limit, skip } = filter;
    const audits: { applicant_id: string }[] = await this.ienapplicantStatusAuditRepository
      .createQueryBuilder()
      .select('applicant_id')
      .where('updated_date < :toDate AND updated_date > :fromDate', {
        toDate: to || dayjs().add(1, 'day').format('YYYY-MM-DD'),
        fromDate: from || '1914-07-18',
      })
      .andWhere({ applicant: Not(IsNull()) })
      .limit(limit)
      .skip(skip)
      .distinct()
      .execute();

    if (!audits.length) {
      return [];
    }
    const ids = audits.map(audit => audit.applicant_id);
    const results = await this.ienapplicantRepository.find({
      where: (qb: any) => {
        qb.where(`IENApplicant.id IN (:...ids)`, { ids });
      },
      relations: [
        'applicant_status_audit',
        'applicant_status_audit.status',
        'applicant_status_audit.job',
        'applicant_status_audit.updated_by',
        'applicant_status_audit.added_by',
      ],
    });

    return results.map((result): ApplicantSyncRO => {
      return {
        id: result.id,
        updated_date: result.updated_date,
        milestone_statuses: result.applicant_status_audit.map(m => {
          const milestone: MilestoneSync = {
            ..._.pick(m, ['id', 'start_date', 'created_date', 'updated_date']),
            status: m.status.id,
            additional_data: null,
          };
          if (m.job) {
            milestone.additional_data = {
              job: _.pick(m.job, [
                'id',
                'job_id',
                'job_post_date',
                'created_date',
                'updated_date',
                'ha_pcn',
              ]),
              reason: m.reason?.id ?? '',
              added_by: m.added_by
                ? _.pick(m.added_by, ['id', 'name', 'email', 'user_id'])
                : undefined,
              updated_by: m.updated_by
                ? _.pick(m.added_by, ['id', 'name', 'email', 'user_id'])
                : undefined,
              ..._.pick(m, ['effective_date', 'reason_other', 'type', 'notes']),
            };
          }
          return milestone;
        }),
      };
    });
  }
}
