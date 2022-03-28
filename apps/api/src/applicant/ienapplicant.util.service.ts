/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { In, IsNull, Repository, ILike, Not } from 'typeorm';
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

@Injectable()
export class IENApplicantUtilService {
  applicantRelations: any;
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

  /**
   * Build a query using given filters
   * @param filter
   * @returns retrun promise of find()
   */
  async applicantFilterQueryBuilder(filter: IENApplicantFilterAPIDTO) {
    const { status, ha_pcn, name } = filter;
    const query: any = {
      order: {
        updated_date: 'DESC',
      },
      relations: this.applicantRelations.status,
    };
    if (!status && !ha_pcn && !name) {
      return this.ienapplicantRepository.find(query);
    }

    let where: any = {};
    let isWhere = false;
    if (status) {
      const status_list = await this.fetchChildStatusList(status);
      where = { status: In(status_list), ...where };
      isWhere = true;
    }

    if (name && name.trim() !== '') {
      where = { name: ILike(`%${name.trim()}%`), ...where };
      isWhere = true;
    }

    let isHaPcn = false;
    if (ha_pcn) {
      // check details to identify filter
      isHaPcn = true;
    }
    if (isHaPcn) {
      const ha_pcn_array = ha_pcn?.split(',');
      return this.ienapplicantRepository.find({
        join: {
          alias: 'ien_applicants',
          innerJoin: { ha_pcn: 'ien_applicants.ha_pcn' },
        },
        where: (qb: any) => {
          qb.where(where).andWhere('ha_pcn.id IN (:...haPcnId)', { haPcnId: ha_pcn_array });
        },
        ...query,
      });
    } else if (isWhere && !isHaPcn) {
      return this.ienapplicantRepository.find({
        where: (qb: any) => {
          qb.where(where);
        },
        ...query,
      });
    } else {
      return this.ienapplicantRepository.find(query);
    }
  }

  /** fetch all status is parent status passed */
  async fetchChildStatusList(status: any): Promise<string[]> {
    const status_list = status.split(',');
    const parent_status = await this.ienapplicantStatusRepository.find({
      where: {
        id: In(status_list),
        parent: IsNull(),
      },
      relations: ['children'],
    });
    if (parent_status.length > 0) {
      for (let i = 0; i < parent_status.length; i++) {
        const children = parent_status[i].children;
        for (let j = 0; j < children.length; j++) {
          status_list.push(`${children[j].id}`);
        }
      }
    }
    return status_list;
  }

  /**
   * Retrive status object for given status ID
   * @param status
   * @returns Status Object or NotFoundException
   */
  async getStatusById(status: string): Promise<IENApplicantStatus | any> {
    const statusObj = await this.ienapplicantStatusRepository.findOne(parseInt(status), {
      relations: ['parent'],
    });
    if (!statusObj) {
      throw new NotFoundException(`Status with given value "${status}" not found`);
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
  async saveApplicantAudit(applicant: IENApplicant, added_by: any) {
    const dataToSave: any = applicant;
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
   * Store applicant status audit details,
   * We are not using it until add-applicant feture enable on IEN portal
   * @param applicant Applicant Object
   */
  async saveApplicantStatusAudit(applicant: IENApplicant) {
    try {
      const dataToSave = {
        applicant: applicant,
        status: applicant.status,
        added_by: applicant.added_by,
        start_date: applicant.status_date,
      };

      const status_audit = this.ienapplicantStatusAuditRepository.create(dataToSave);
      await this.ienapplicantStatusAuditRepository.save(status_audit);
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
    job: IENApplicantJob,
  ): Promise<any> {
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
  async updatePreviousActiveStatusForJob(job: any, data: any): Promise<void> {
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
            updated_by: data.added_by,
            end_date: data.start_date,
          };
          const list_status: IENApplicantStatusAudit[] = [];
          for (let i = 0; i < previousStatus.length; i++) {
            list_status.push({
              ...previousStatus[i],
              ...updateData,
              status_period: 0, // added for entity restriction error
            });
          }
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
   * @param ha_pcn
   */
  async getHaPcn(ha_pcn: any): Promise<IENHaPcn | any> {
    const ha_pcn_data = await this.ienHaPcnRepository.find({
      where: {
        id: In(ha_pcn),
      },
    });
    if (ha_pcn_data.length !== ha_pcn.length) {
      throw new NotFoundException('Provided all or some of HA not found');
    }
    return ha_pcn_data;
  }

  /**
   * Get Users list for the provided IDs
   * @param users
   * @returns
   */
  async getUserArray(users: any): Promise<IENUsers | any> {
    const users_data = await this.ienUsersRepository.find({
      where: {
        id: In(users),
      },
    });
    if (users_data.length !== users.length) {
      throw new NotFoundException('Provided all or some of Users not found');
    }
    return users_data;
  }

  /**
   * Get Job
   * @param id
   */
  async getJob(id: string | number): Promise<IENApplicantJob | any> {
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
  async getJobTitle(id: string | number): Promise<IENJobTitle | any> {
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
  async getJobLocation(id: string | number): Promise<IENJobLocation | any> {
    const job_title = await this.ienapplicantJobLocationRepository.findOne(id);
    if (!job_title) {
      throw new NotFoundException('Provided job location not found');
    }
    return job_title;
  }
}
