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
  In,
  IsNull,
  Not,
  Repository,
  FindManyOptions,
  ObjectLiteral,
  SelectQueryBuilder,
  Between,
} from 'typeorm';
import dayjs from 'dayjs';
import { Authorities } from '@ien/common';
import { ExternalRequest } from 'src/common/external-request';
import { AppLogger } from 'src/common/logger.service';
import { getMilestoneCategory } from 'src/common/util';
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
        const listHa = data
          .filter(({ name }) => name !== 'Education' && name !== 'Other') // until ATS fixes ha list
          .map(item => {
            return {
              id: item.id,
              title: item.name,
              abbreviation: item?.abbreviation,
            };
          });
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
      const data = await this.external_request.getMilestone();
      if (Array.isArray(data)) {
        const result = await this.ienMasterService.ienApplicantStatusRepository.upsert(
          this.cleanAndFilterMilestone(data),
          ['id'],
        );
        this.logger.log(`${result.raw.length}/${data.length} milestones updated`, 'ATS');
      }
    } catch (e) {
      this.logger.log(`Error in saveMilestones(): ${e}`, 'ATS');
    }
  }

  cleanAndFilterMilestone(data: any) {
    return data.reduce(
      (
        filtered: {
          parent: number;
          id: string | number;
          status: string;
          party: string;
          full_name: string;
        }[],
        item: {
          category: string;
          id: string | number;
          name: string;
          party: string;
          full_name: string;
        },
      ) => {
        const category = getMilestoneCategory(item.category);
        if (category && category !== 10003) {
          filtered.push({
            id: item.id,
            status: item.name,
            party: item.party,
            parent: category,
            full_name: item?.full_name,
          });
        }
        return filtered;
      },
      [],
    );
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

    const parallel_requests = 5;

    const audit = await this.saveSyncApplicantsAudit();
    try {
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
          from_date,
          to_date,
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

      await this.createBulkApplicants(newData);
      await this.saveSyncApplicantsAudit(audit.id, true);
      this.logger.log(`processed ${newData.length} applicants record`);
      return {
        from: from_date,
        to: to_date,
        count: newData.length,
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
      const processed_applicant = await this.ienapplicantRepository.upsert(applicants, [
        'applicant_id',
      ]);
      this.logger.log(`processed applicants`);
      const mappedApplicantList = processed_applicant?.raw.map((item: { id: string | number }) => {
        return item.id;
      });

      // Upsert milestones
      const milestones = await this.mapMilestones(data, mappedApplicantList);
      if (milestones.length > 0) {
        try {
          const updatedstatus = await this.ienapplicantStatusAuditRepository
            .createQueryBuilder()
            .insert()
            .into(IENApplicantStatusAudit)
            .values(milestones)
            .orIgnore(`("status_id", "applicant_id", "start_date") WHERE job_id IS NULL`)
            .execute();
          this.logger.log(`updatedstatus`);
          this.logger.log(`milestone count ${milestones.length}`);
          this.logger.log(`updatedstatus.raw count ${updatedstatus.raw.length}`);
        } catch (e) {
          this.logger.log(`milestone upsert error`);
          this.logger.error(e);
        }
      }

      // update applicant with latest status
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
    const { users, ha } = await this.getApplicantMasterData();
    return data.map(
      (a: {
        health_authorities: { title: string; id: number | string; name?: string }[] | undefined;
        assigned_to: { id: string | number; name: string }[] | undefined;
        registration_date: string;
        applicant_id: string | number;
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
        let health_authorities = null;
        if (a.health_authorities && a.health_authorities != undefined) {
          health_authorities = a.health_authorities.map(
            (h: { title: string; id: number | string; name?: string }) => {
              h.title = ha[`${h.id}`]?.title;
              if (h.hasOwnProperty('name')) {
                delete h.name;
              }
              return h;
            },
          );
        }

        let assigned_to = null;
        if (a.assigned_to && a.assigned_to != undefined) {
          assigned_to = a.assigned_to.map((user: { id: string | number; name: string }) => {
            user.name = users[user.id].name;
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
          applicant_id: a.applicant_id,
          name: `${a.first_name} ${a.last_name}`,
          email_address: a.email_address,
          phone_number: a.phone_number,
          registration_date: new Date(a.registration_date),
          country_of_citizenship: citizenship,
          country_of_residence: a?.country_of_residence,
          bccnm_license_number: a?.bccnm_license_number,
          pr_status: a?.pr_status,
          nursing_educations: a?.nursing_educations,
          health_authorities,
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
  async allowedMilestones(): Promise<number[] | []> {
    const allowedIds: number[] = [];
    const milestones = await this.ienMasterService.ienApplicantStatusRepository.find({
      select: ['id'],
      where: {
        parent: In([10001, 10002, 10004, 10005]),
      },
    });
    milestones.forEach(a => allowedIds.push(a.id));
    return allowedIds;
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
    const applicantIdsMapping: any = {};
    const milestones: any = [];
    if (savedApplicants.length <= 0) {
      return [];
    }
    savedApplicants.forEach(item => {
      applicantIdsMapping[`${item.applicant_id}`] = item.id;
    });
    const allowedMilestones: number[] = await this.allowedMilestones();
    data.forEach(
      (item: {
        applicant_id: string | number;
        hasOwnProperty: (arg0: string) => any;
        milestones: any;
      }) => {
        const tableId = applicantIdsMapping[item.applicant_id];
        if (item.hasOwnProperty('milestones') && Array.isArray(item.milestones)) {
          const existingMilestones = item.milestones;
          existingMilestones.forEach(m => {
            this.mapMilestoneData(allowedMilestones, m, milestones, tableId, users);
          });
        }
      },
    );
    return milestones;
  }

  /** create applicant-milestone object */
  mapMilestoneData(
    allowedMilestones: number[],
    m: {
      id: number;
      start_date: string;
      created_date: string;
      note: any;
      added_by: number;
      reason_id: number | string;
      reason_other: string;
      effective_date: string;
    },
    milestones: any[],
    tableId: any,
    users: any[],
  ) {
    if (allowedMilestones.includes(m.id)) {
      const temp: any = {
        status: m.id,
        start_date: m.start_date,
        created_date: m.created_date,
        updated_date: m.created_date,
        applicant: tableId,
        notes: m?.note,
        added_by: null,
      };
      if ('added_by' in m && m.added_by > 0 && users[m.added_by]) {
        temp['added_by'] = users[m.added_by].id;
      }
      if ('reason_id' in m) {
        temp['reason'] = m.reason_id;
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

  async getApplicants(start?: string, end?: string) {
    return this.ienapplicantRepository.find({
      where: {
        updated_date: Between(
          new Date(start || '1918-07-18').toISOString(),
          end ? new Date(end).toISOString() : new Date().toISOString(),
        ),
      },
      relations: [
        'status',
        'added_by',
        'updated_by',
        'jobs',
        'applicant_status_audit',
        'applicant_audit',
      ],
    });
  }
}
