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
} from 'typeorm';
import dayjs from 'dayjs';
import { Authorities, StatusCategory } from '@ien/common';
import { ExternalRequest } from 'src/common/external-request';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicant } from './entity/ienapplicant.entity';
import { IENApplicantStatusAudit } from './entity/ienapplicant-status-audit.entity';
import { IENApplicantUtilService } from './ienapplicant.util.service';
import { SyncApplicantsAudit } from './entity/sync-applicants-audit.entity';
import { IENMasterService } from './ien-master.service';
import { IENUsers } from './entity/ienusers.entity';
import { IENUserFilterAPIDTO, SyncApplicantsResultDTO } from './dto';

@Injectable()
export class ExternalAPIService {
  applicantRelations: any;
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @Inject(ExternalRequest) private readonly external_request: ExternalRequest,
    @Inject(IENApplicantUtilService)
    private readonly ienapplicantUtilService: IENApplicantUtilService,
    @Inject(IENMasterService)
    private readonly ienMasterService: IENMasterService,
    @InjectRepository(IENApplicant)
    private readonly ienapplicantRepository: Repository<IENApplicant>,
    @InjectRepository(IENApplicantStatusAudit)
    private readonly ienapplicantStatusAuditRepository: Repository<IENApplicantStatusAudit>,
    @InjectRepository(SyncApplicantsAudit)
    private readonly syncApplicantsAuditRepository: Repository<SyncApplicantsAudit>,
  ) {}

  /**
   * Save all data for master tables.
   */
  async saveData() {
    if (!process.env.HMBC_ATS_AUTH_KEY || !process.env.HMBC_ATS_BASE_URL) {
      throw new InternalServerErrorException('ATS endpoint is not set.');
    }
    this.logger.log(`Using ATS : ${process.env.HMBC_ATS_BASE_URL}`);
    const ha = this.saveHa();
    const users = this.saveUsers();
    const reasons = this.saveReasons();
    const departments = this.saveDepartments();
    const milestones = this.saveMilestones();

    await Promise.all([ha, users, reasons, departments, milestones]).then(res => {
      this.logger.log(`Response: ${res}`);
      this.logger.log(`Master tables imported at ${new Date()}`);
    });
  }

  /**
   * Collect HealthAuthorities data from <domain>/HealthAuthority Url.
   * and Save in ien_ha_pcn table in database for applicant reference.
   */
  async saveHa(): Promise<void> {
    try {
      const data = await this.external_request.getHa();
      if (Array.isArray(data)) {
        const listHa = data.map(item => ({ ...item, title: item.name }));
        const result = await this.ienMasterService.ienHaPcnRepository.upsert(listHa, ['id']);
        this.logger.log(`${result.raw.length}/${listHa.length} authorities updated`, 'ATS');
      }
    } catch (e) {
      this.logger.log(e);
      this.logger.log(`Error in saveHa(): ${e}`, 'ATS');
    }
  }

  /**
   * Collect Staff/User data from <domain>/staff Url.
   * and Save in ien_users table in database for applicant reference.
   */
  async saveUsers(): Promise<void> {
    try {
      const data = await this.external_request.getStaff();
      if (Array.isArray(data)) {
        const listUsers = data.map(item => {
          return {
            user_id: item.id,
            name: item.name,
            email: item?.email,
          };
        });
        const result = await this.ienMasterService.ienUsersRepository.upsert(listUsers, [
          'user_id',
        ]);
        this.logger.log(`${result.raw.length}/${listUsers.length} users updated`, 'ATS');
      }
    } catch (e) {
      this.logger.log(`Error in saveUsers(): ${e}`, 'ATS');
    }
  }

  /**
   * Collect Milestone reason data from <domain>/Reason Url.
   * and Save in ien_status_reasons table in database for milestone/status reference.
   */
  async saveReasons(): Promise<void> {
    try {
      const data = await this.external_request.getReason();
      if (Array.isArray(data)) {
        const result = await this.ienMasterService.ienStatusReasonRepository.upsert(data, ['id']);
        this.logger.log(`${result.raw.length}/${data.length} reasons updated`, 'ATS');
      }
    } catch (e) {
      this.logger.log(`Error in saveReasons(): ${e}`, 'ATS');
    }
  }

  /**
   * Collect Job-competition department data from <domain>/department Url.
   * and Save in ien_job_titles table in database for department reference.
   */
  async saveDepartments(): Promise<void> {
    try {
      const data = await this.external_request.getDepartment();
      if (Array.isArray(data)) {
        const departments = data.map(item => {
          return {
            id: item.id,
            title: item.name,
          };
        });
        const result = await this.ienMasterService.ienJobTitleRepository.upsert(departments, [
          'id',
        ]);
        this.logger.log(`${result.raw.length}/${departments.length} departments updated`, 'ATS');
      }
    } catch (e) {
      this.logger.log(`Error in saveDepartments(): ${e}`, 'ATS');
    }
  }

  /**
   * Let's clean and map status/milestone object with existing schema
   * and upsert it.
   */
  async saveMilestones(): Promise<void> {
    try {
      const data: { id: string; name: string; category: string; 'process-related': boolean } =
        await this.external_request.getMilestone();

      if (Array.isArray(data)) {
        const result = await this.ienMasterService.ienApplicantStatusRepository.upsert(
          data.map(row => ({ ...row, status: row.name })), // name -> status
          ['id'],
        );
        this.logger.log(`${result.raw.length}/${data.length} milestones updated`, 'ATS');
      }
    } catch (e) {
      this.logger.log(`Error in saveMilestones(): ${e}`, 'ATS');
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
          `/Applicant?next=${per_page}&offset=${offset}&from=${from_date}&to=${to_date}`,
        ),
      );
      this.logger.log(
        `/Applicant?next=${per_page}&offset=${offset}&from=${from_date}&to=${to_date}`,
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
    let newData: any[] = [];

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
          this.logger.log(`${temp.length}, ${Array.isArray(r) ? r.length : 0}`);
          temp = temp.concat(r);
        });
      });
      this.logger.log(`temp ${temp.length} and ${parallel_requests * per_page}`);
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
      // restore after updating ats endpoints
      // const applicants = await this.fetchApplicantsFromATS(from_date, to_date);
      const applicants = await this.external_request.getData('/applicant');

      await this.createBulkApplicants(applicants);
      await this.removeMilestonesNotOnATS(applicants);
      await this.saveSyncApplicantsAudit(audit.id, true);
      return {
        from: from_date,
        to: to_date,
        count: applicants.length,
      };
    } catch (e: any) {
      await this.saveSyncApplicantsAudit(audit.id, false, { message: e.message, stack: e.stack });
      this.logger.error(e);
    }
  }

  async saveSyncApplicantsAudit(
    id: number | undefined = undefined,
    is_success = false,
    additional_data: object | undefined | unknown = undefined,
  ): Promise<SyncApplicantsAudit> {
    if (id) {
      const audit = await this.syncApplicantsAuditRepository.findOne(id);
      if (audit) {
        audit.is_success = is_success;
        audit.additional_data = additional_data;
        await this.syncApplicantsAuditRepository.save(audit);
        return audit;
      }
    }
    const addAuditData: object = {
      is_success,
      additional_data,
    };
    const newAudit = this.syncApplicantsAuditRepository.create(addAuditData);
    await this.syncApplicantsAuditRepository.save(newAudit);
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
  async getApplicantMasterData() {
    // fetch user/staff details
    const usersArray = await this.ienMasterService.ienUsersRepository.find({
      user_id: Not(IsNull()),
    });
    const users: any = {};
    usersArray.forEach(user => {
      if (user.user_id) {
        users[user.user_id] = user;
      }
    });
    // Fetch Health Authorities
    const haArray = await this.ienMasterService.ienHaPcnRepository.find();
    const ha: any = {};
    haArray.forEach(ha_obj => {
      ha[ha_obj.id] = ha_obj;
    });
    return { users: users, ha: ha };
  }

  async removeMilestonesNotOnATS(
    applicants: { applicant_id: string; milestones: { id: string }[] }[],
  ): Promise<void> {
    let removedCount = 0;
    await Promise.all(
      applicants.map(async a => {
        const audits: { id: string; status_id: string }[] = await getManager().query(`
        SELECT "audit"."id" id, "status"."id" status_id
        FROM "ien_applicant_status_audit" "audit"
        INNER JOIN "ien_applicant_status" "status" ON "status"."id" = "audit"."status_id"
        WHERE
          "audit"."applicant_id" = '${a.applicant_id.toLowerCase()}' AND
          "status"."category" != 'IEN Recruitment Process';
      `);

        if (!audits.length) return;

        const removed = audits.filter(
          ({ status_id }) => !a.milestones.some(m => m.id.toLowerCase() === status_id),
        );
        if (removed.length > 0) {
          const result = await this.ienapplicantStatusAuditRepository.delete(
            removed.map(r => r.id),
          );
          removedCount += result.affected || 0;
        }
      }),
    );

    this.logger.log(`milestones deleted: ${removedCount}`, 'ATS-SYNC');
  }

  /**
   * Clean raw data and save applicant info into 'ien_applicant' table.
   * @param data Raw Applicant data
   */
  async createBulkApplicants(data: any) {
    // upsert applicant list first
    if (!Array.isArray(data)) {
      this.logger.error(`Applicant data error:`, data);
      return;
    }
    const applicants = await this.mapApplicants(data);
    if (applicants.length > 0) {
      const processed_applicant = await this.ienapplicantRepository.upsert(applicants, ['id']);
      this.logger.log(
        `applicants synced: ${processed_applicant.raw.length}/${data.length}`,
        'ATS-SYNC',
      );
      const mappedApplicantList = processed_applicant?.raw.map((item: { id: string }) => item.id);

      // Upsert milestones
      const milestones = await this.mapMilestones(data, mappedApplicantList);
      if (milestones.length > 0) {
        try {
          const result = await this.ienapplicantStatusAuditRepository
            .createQueryBuilder()
            .insert()
            .into(IENApplicantStatusAudit)
            .values(milestones)
            .orIgnore(true)
            .execute();
          this.logger.log(
            `applicant milestones updated: ${result.raw.length}/${milestones.length}`,
            'ATS-SYNC',
          );
        } catch (e) {
          this.logger.error(e);
        }
      }

      // update applicant with the latest status
      await this.ienapplicantUtilService.updateLatestStatusOnApplicant(mappedApplicantList);
    } else {
      this.logger.log(`No applicants received today`);
    }
  }

  /**
   * Map raw data with existing applicant schema
   * @param data raw applicant data
   * @returns object that use in upsert applicants
   */
  async mapApplicants(data: any) {
    const { users } = await this.getApplicantMasterData();
    return data.map(
      (a: {
        assigned_to: { id: string; name: string }[] | undefined;
        registration_date: string;
        applicant_id: string;
        first_name: string;
        last_name: string;
        email_address: string;
        phone_number: string;
        countries_of_citizenship: string[] | string;
        country_of_residence: string;
        bccnm_license_number: string;
        pr_status: string;
        nursing_educations: any;
        notes: any;
        created_date: string;
        updated_date: string;
      }) => {
        let assigned_to = null;
        if (a.assigned_to && a.assigned_to != undefined) {
          assigned_to = a.assigned_to.map((user: { id: string; name: string }) => {
            user.name = users[user.id.toLowerCase()]?.name;
            return user;
          });
        }

        let citizenship = null;
        if (a.countries_of_citizenship && Array.isArray(a.countries_of_citizenship)) {
          citizenship = a.countries_of_citizenship;
        } else {
          citizenship = a.countries_of_citizenship ? [a.countries_of_citizenship] : null;
        }

        return {
          id: a.applicant_id.toLowerCase(),
          name: `${a.first_name} ${a.last_name}`,
          email_address: a.email_address,
          phone_number: a.phone_number,
          registration_date: new Date(a.registration_date),
          country_of_citizenship: citizenship,
          country_of_residence: a?.country_of_residence,
          bccnm_license_number: a?.bccnm_license_number,
          pr_status: a?.pr_status,
          nursing_educations: a?.nursing_educations,
          notes: a?.notes,
          assigned_to,
          additional_data: {
            first_name: a.first_name,
            last_name: a.last_name,
          },
          created_date: a.created_date,
          updated_date: a.updated_date,
        };
      },
    );
  }

  /**
   * We need to ignore all the recruiment related milestone for now
   */
  async allowedMilestones(): Promise<string[] | []> {
    const milestones = await this.ienMasterService.ienApplicantStatusRepository.find({
      select: ['id'],
      where: {
        category: Not([StatusCategory.RECRUITMENT]),
      },
    });
    return milestones.map(({ id }) => id);
  }

  /**
   *
   * @param data raw applicant data
   * @param mappedApplicantList applicant_id and applicant.id map
   * @returns object that use in upsert milestone/status
   */
  async mapMilestones(data: any, mappedApplicantList: string[]) {
    const { users } = await this.getApplicantMasterData();
    const savedApplicants = await this.ienapplicantRepository.findByIds(mappedApplicantList);
    const milestones: any = [];
    if (savedApplicants.length <= 0) {
      return [];
    }
    const allowedMilestones: string[] = await this.allowedMilestones();
    data.forEach(
      (item: { applicant_id: string; hasOwnProperty: (arg0: string) => any; milestones: any }) => {
        if (item.hasOwnProperty('milestones') && Array.isArray(item.milestones)) {
          const existingMilestones = item.milestones;
          existingMilestones.forEach(m => {
            this.mapMilestoneData(allowedMilestones, m, milestones, item.applicant_id, users);
          });
        }
      },
    );
    return milestones;
  }

  /** create applicant-milestone object */
  mapMilestoneData(
    allowedMilestones: string[],
    m: {
      id: string;
      start_date: string;
      created_date: string;
      note: any;
      added_by: number;
      reason_id: string;
      reason_other: string;
      effective_date: string;
    },
    milestones: any[],
    applicant_id: any,
    users: any[],
  ) {
    if (allowedMilestones.includes(m?.id.toLowerCase())) {
      const temp: any = {
        status: m.id.toLowerCase(),
        start_date: m.start_date,
        created_date: m.created_date,
        updated_date: m.created_date,
        applicant: applicant_id.toLowerCase(),
        notes: m?.note,
        added_by: null,
      };
      if ('added_by' in m && m.added_by > 0 && users[m.added_by]) {
        temp['added_by'] = users[m.added_by].id;
      }
      if ('reason_id' in m) {
        temp['reason'] = m.reason_id.toLowerCase();
      }
      if ('reason_other' in m) {
        temp['reason_other'] = m.reason_other;
      }
      if ('effective_date' in m) {
        temp['effective_date'] = m.effective_date;
      }
      milestones.push(temp);
    } else {
      this.logger.log(`rejected Id ${m.id}`);
    }
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

  async getApplicants(filter: IENUserFilterAPIDTO) {
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
    return this.ienapplicantRepository.find({
      where: (qb: any) => {
        qb.where(`IENApplicant.id IN (:...ids)`, { ids });
      },
      relations: ['applicant_status_audit'],
    });
  }
}
