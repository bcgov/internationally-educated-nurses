/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  In,
  IsNull,
  Repository,
  Not,
  FindManyOptions,
  getManager,
  ObjectLiteral,
  SelectQueryBuilder,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicantStatus } from './entity/ienapplicant-status.entity';
import { IENApplicant } from './entity/ienapplicant.entity';
import { IENApplicantFilterAPIDTO } from './dto/ienapplicant-filter.dto';
import { IENApplicantAudit } from './entity/ienapplicant-audit.entity';
import { IENApplicantStatusAudit } from './entity/ienapplicant-status-audit.entity';
import { CommonData } from 'src/common/common.data';
import { IENApplicantJob } from './entity/ienjob.entity';
import { IENHaPcn } from './entity/ienhapcn.entity';
import { IENUsers } from './entity/ienusers.entity';
import { IENJobTitle } from './entity/ienjobtitles.entity';
import { IENJobLocation } from './entity/ienjoblocation.entity';
import { IENStatusReason } from './entity/ienstatus-reason.entity';

@Injectable()
export class IENApplicantUtilService {
  applicantRelations;
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @InjectRepository(IENApplicantStatus)
    private readonly ienapplicantStatusRepository: Repository<IENApplicantStatus>,
    @InjectRepository(IENApplicant)
    private readonly ienapplicantRepository: Repository<IENApplicant>,
    @InjectRepository(IENApplicantAudit)
    private readonly ienapplicantAuditRepository: Repository<IENApplicantAudit>,
    @InjectRepository(IENApplicantStatusAudit)
    private readonly ienapplicantStatusAuditRepository: Repository<IENApplicantStatusAudit>,
    @InjectRepository(IENHaPcn)
    private readonly ienHaPcnRepository: Repository<IENHaPcn>,
    @InjectRepository(IENStatusReason)
    private readonly ienStatusReasonRepository: Repository<IENStatusReason>,
    @InjectRepository(IENUsers)
    private readonly ienUsersRepository: Repository<IENUsers>,
    @InjectRepository(IENJobTitle)
    private readonly ienapplicantJobTitleRepository: Repository<IENJobTitle>,
    @InjectRepository(IENJobLocation)
    private readonly ienapplicantJobLocationRepository: Repository<IENJobLocation>,
    @InjectRepository(IENApplicantJob)
    private readonly ienapplicantJobRepository: Repository<IENApplicantJob>,
  ) {
    this.applicantRelations = CommonData;
  }

  _nameSearchQuery(keyword: string) {
    let keywords = keyword.split(' ');
    keywords = keywords.filter(item => item.length);
    if (keywords.length === 1) {
      return `(IENApplicant.name ilike '%${keywords[0].toLowerCase()}%')`;
    } else if (keywords.length === 2) {
      return `(IENApplicant.name ilike '%${keywords[0]}%${keywords[1]}%' OR IENApplicant.name ilike '%${keywords[1]}%${keywords[0]}%')`;
    } else if (keywords.length === 3) {
      const possibleShuffle = [];
      possibleShuffle.push(
        `IENApplicant.name ilike '%${keywords[0]}%${keywords[1]}%${keywords[2]}%'`,
      );
      possibleShuffle.push(
        `IENApplicant.name ilike '%${keywords[0]}%${keywords[2]}%${keywords[1]}%'`,
      );
      possibleShuffle.push(
        `IENApplicant.name ilike '%${keywords[1]}%${keywords[0]}%${keywords[2]}%'`,
      );
      possibleShuffle.push(
        `IENApplicant.name ilike '%${keywords[1]}%${keywords[2]}%${keywords[0]}%'`,
      );
      possibleShuffle.push(
        `IENApplicant.name ilike '%${keywords[2]}%${keywords[0]}%${keywords[1]}%'`,
      );
      possibleShuffle.push(
        `IENApplicant.name ilike '%${keywords[2]}%${keywords[1]}%${keywords[0]}%'`,
      );
      return `( ${possibleShuffle.join(' OR ')} )`;
    }
    return `IENApplicant.name ilike '%${keyword}%'`;
  }

  /**
   * Build a query using given filters
   * @param filter
   * @returns retrun promise of find()
   */
  async applicantFilterQueryBuilder(filter: IENApplicantFilterAPIDTO) {
    const { status, ha_pcn, name, sortKey, order, limit, skip } = filter;
    const query: FindManyOptions<IENApplicant> = {
      order: {
        [sortKey || 'updated_date']: sortKey ? order : 'DESC',
      },
      relations: this.applicantRelations.status,
    };

    if (limit) query.take = limit;
    if (skip) query.skip = skip;

    if (!status && !ha_pcn && !name) {
      return this.ienapplicantRepository.findAndCount(query);
    }
    const conditions: (string | ObjectLiteral)[] = [];

    if (status) {
      const status_list = await this.fetchChildStatusList(status);
      this.logger.log(`milestone/status list that are apply as a filter: [${status_list}]`);
      conditions.push({ status: In(status_list) });
    }

    if (name) {
      conditions.push(this._nameSearchQuery(name));
    }

    if (ha_pcn) {
      const ha_pcn_array = ha_pcn?.split(',');
      const condition = ha_pcn_array
        ?.map(id => {
          return `health_authorities @> '[{"id":${id}}]'`;
        })
        .join(' OR ');
      conditions.push(`(${condition})`);
    }

    if (conditions.length > 0) {
      return this.ienapplicantRepository.findAndCount({
        where: (qb: SelectQueryBuilder<IENApplicant>) => {
          const condition = conditions.shift();
          if (condition) qb.where(condition);
          conditions.forEach(c => qb.andWhere(c));
        },
        ...query,
      });
    } else {
      return this.ienapplicantRepository.findAndCount(query);
    }
  }

  /** fetch all status if parent status passed */
  async fetchChildStatusList(status: string): Promise<string[]> {
    const status_list = status.split(',');
    const parent_status = await this.ienapplicantStatusRepository.find({
      where: {
        id: In(status_list),
        parent: IsNull(),
      },
      relations: ['children'],
    });
    if (parent_status.length > 0) {
      parent_status.forEach(s => {
        const children = s.children;
        children.forEach(c => {
          status_list.push(`${c.id}`);
        });
      });
    }
    return status_list;
  }

  /**
   * Retrive status object for given status ID
   * @param status
   * @returns Status Object or NotFoundException
   */
  async getStatusById(status: string): Promise<IENApplicantStatus> {
    const statusObj = await this.ienapplicantStatusRepository.findOne(parseInt(status), {
      relations: ['parent'],
    });
    if (!statusObj) {
      throw new NotFoundException(`Status with given value "${status}" not found`);
    }
    if (statusObj) {
      if (statusObj.parent?.id != 10003) {
        throw new BadRequestException(
          `Only recruitment-related milestones/statuses are allowed here`,
        );
      }
    }
    return statusObj;
  }

  /**
   * Applicant information and Status Audit
   */

  /**
   *
   * @param applicant Applicant Object
   * @param added_by Passing it separately, In case of update we have to use updated_by field in place of added_by
   */
  async saveApplicantAudit(applicant: IENApplicant, added_by: IENUsers) {
    const dataToSave: object = applicant;
    try {
      const audit = this.ienapplicantAuditRepository.create({
        applicant: applicant,
        added_by: added_by,
        data: dataToSave,
      });
      await this.ienapplicantAuditRepository.save(audit);
    } catch (e) {}
  }

  /**
   * Add new status/Milestone
   * @param applicant
   * @param dataToUpdate
   * @param job
   */
  async addApplicantStatusAudit(
    applicant: IENApplicant,
    dataToUpdate: any,
    job: IENApplicantJob | null,
  ): Promise<IENApplicantStatusAudit | any> {
    // Save
    const status_audit = this.ienapplicantStatusAuditRepository.create({
      applicant: applicant,
      job: job,
      ...dataToUpdate,
    });
    await this.ienapplicantStatusAuditRepository.save(status_audit);
    return status_audit;
  }

  /**
   * Update end_date in previous active status/milestone
   * @param job Job object to check active status/milestone
   * @param data status/milestone audit data
   */
  async updatePreviousActiveStatusForJob(job: IENApplicantJob, data: any): Promise<void> {
    try {
      if (job) {
        const previousStatus = await this.ienapplicantStatusAuditRepository.find({
          where: {
            status: Not(data.status.id),
            job: job,
            end_date: IsNull(),
          },
        });
        // In best case scenario there is only one record here
        // Let's not put hard limit right now, and accept multiple records here.
        if (previousStatus.length > 0) {
          const updateData = {
            end_date: data.start_date,
          };
          const list_status: IENApplicantStatusAudit[] = [];
          previousStatus.forEach(status => {
            list_status.push({
              ...status,
              ...updateData,
            });
          });
          await this.ienapplicantStatusAuditRepository.save(list_status);
        }
      }
    } catch (e) {
      // No requirement to throw any error here. so let's log it.
      // when start working on report, We will push it in some eror reporting tool to notify developer.
      this.logger.error(e);
    }
  }

  /**
   * Get HA or PCN list for the provided IDs
   * @param health_authorities
   */
  async getHaPcns(health_authorities: any): Promise<IENHaPcn | any> {
    const ha_pcn = health_authorities.map((item: { id: string | number }) => item.id);
    const key_object: any = {};
    health_authorities.forEach((item: { id: string | number }) => {
      key_object[item.id] = item;
    });
    const ha_pcn_data = await this.ienHaPcnRepository.find({
      where: {
        id: In(ha_pcn),
      },
    });
    if (ha_pcn_data.length !== ha_pcn.length) {
      throw new NotFoundException('Provided all or some of HA not found');
    }
    return ha_pcn_data.map(item => {
      return {
        ...key_object[item.id],
        ...item,
      };
    });
  }

  async getHaPcn(id: number): Promise<IENHaPcn> {
    const health_authority = await this.ienHaPcnRepository.findOne(id);
    if (!health_authority) {
      throw new NotFoundException('Provided all or some of HA not found');
    }
    return health_authority;
  }

  /**
   * Get Users list for the provided IDs
   * @param users
   * @returns
   */
  async getUserArray(users: any): Promise<IENUsers | any> {
    users = users.map((item: { id: number | string }) => item.id);
    const users_data = await this.ienUsersRepository.find({
      where: {
        id: In(users),
      },
    });
    if (users_data.length !== users.length) {
      throw new NotFoundException('Provided all or some of Users not found');
    }
    return users_data.map(item => {
      return { id: item.id, name: item.name };
    });
  }

  /**
   * Get Job
   * @param id
   */
  async getJob(id: string | number): Promise<IENApplicantJob> {
    const job = await this.ienapplicantJobRepository.findOne(id, {
      relations: ['applicant'],
    });
    if (!job) {
      throw new NotFoundException('Provided job not found');
    }
    return job;
  }

  /**
   * Get Job title
   * @param id
   */
  async getJobTitle(id: string | number): Promise<IENJobTitle> {
    const job_title = await this.ienapplicantJobTitleRepository.findOne(id);
    if (!job_title) {
      throw new NotFoundException('Provided job title not found');
    }
    return job_title;
  }

  /**
   * Get Job Location
   * @param id
   */
  async getJobLocation(id: string | number): Promise<IENJobLocation> {
    const job_location = await this.ienapplicantJobLocationRepository.findOne(id);
    if (!job_location) {
      throw new NotFoundException('Provided job location not found');
    }
    return job_location;
  }

  async getJobLocations(ids: string[] | number[]): Promise<IENJobLocation[] | []> {
    return this.ienapplicantJobLocationRepository.findByIds(ids);
  }

  async updateLatestStatusOnApplicant(mappedApplicantList: string[]): Promise<void> {
    try {
      // update applicant with latest status
      const idsToUpdate = `'${mappedApplicantList.join("','")}'`;
      const queryToUpdate = `UPDATE ien_applicants SET status_id = (SELECT status_id FROM ien_applicant_status_audit asa WHERE asa.applicant_id=ien_applicants.id ORDER BY asa.start_date DESC limit 1) WHERE ien_applicants.id IN (${idsToUpdate})`;
      const updatedApplicants = await getManager().query(queryToUpdate);
      this.logger.log({ updatedApplicants });
    } catch (e) {
      this.logger.log(`Error in update latest status on applicant`);
      this.logger.error(e);
    }
  }

  async getStatusReason(id: number): Promise<IENStatusReason> {
    const statusReason = await this.ienStatusReasonRepository.findOne(id);
    if (!statusReason) {
      throw new NotFoundException('Provided Milestone/Status reason not found');
    }
    return statusReason;
  }
}
