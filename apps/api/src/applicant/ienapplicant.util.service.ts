/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { In, Repository, getManager, EntityManager, Brackets } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicantStatus } from './entity/ienapplicant-status.entity';
import { IENApplicant } from './entity/ienapplicant.entity';
import { IENApplicantFilterAPIDTO } from './dto/ienapplicant-filter.dto';
import { IENApplicantAudit } from './entity/ienapplicant-audit.entity';
import { IENApplicantStatusAudit } from './entity/ienapplicant-status-audit.entity';
import { IENApplicantJob } from './entity/ienjob.entity';
import { IENHaPcn } from './entity/ienhapcn.entity';
import { IENUsers } from './entity/ienusers.entity';
import { IENJobTitle } from './entity/ienjobtitles.entity';
import { IENJobLocation } from './entity/ienjoblocation.entity';
import { IENStatusReason } from './entity/ienstatus-reason.entity';
import { IENMasterService } from './ien-master.service';
import { searchNamesAndAts1Id } from 'src/common/search-names';

@Injectable()
export class IENApplicantUtilService {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @Inject(IENMasterService)
    private readonly ienMasterService: IENMasterService,
    @InjectRepository(IENApplicant)
    private readonly ienapplicantRepository: Repository<IENApplicant>,
    @InjectRepository(IENApplicantAudit)
    private readonly ienapplicantAuditRepository: Repository<IENApplicantAudit>,
    @InjectRepository(IENApplicantStatusAudit)
    private readonly ienapplicantStatusAuditRepository: Repository<IENApplicantStatusAudit>,
    @InjectRepository(IENApplicantJob)
    private readonly ienapplicantJobRepository: Repository<IENApplicantJob>,
  ) {}

  /**
   * Build a query using given filters
   * @param filter
   * @param ha_pcn_id
   * @returns promise of find()
   */

  async applicantFilterQueryBuilder(
    filter: IENApplicantFilterAPIDTO,
    ha_pcn_id: string | undefined | null,
  ) {
    const { status, name, recruiter, sortKey, order, limit, skip, showHiddenApplicants } = filter;
    const builder = this.ienapplicantRepository.createQueryBuilder('applicant');
    builder.leftJoinAndSelect('applicant.status', 'latest_status');
    if (ha_pcn_id) {
      const haPcn = await this.getHaPcn(ha_pcn_id);
      builder
        .innerJoin('ien_applicant_status_audit', 'audit', 'applicant.id = audit.applicant_id')
        .innerJoin('ien_applicant_status', 'status', 'status.id = audit.status_id')
        .leftJoinAndSelect(
          'applicant.active_flags',
          'active_flag',
          `active_flag.applicant_id = applicant.id AND active_flag.ha_id = '${ha_pcn_id}'`,
        );

      if (!showHiddenApplicants) {
        builder.andWhere(
          new Brackets(qb => {
            qb.where('active_flag.is_active IS NULL').orWhere(`active_flag.is_active = :isActive`, {
              isActive: true,
            });
          }),
        );
        // if has end_of_journey, then archive applicant
        builder.andWhere(`applicant.end_of_journey IS NULL`);

        // if has deleted_date, then archive applicant
        builder.andWhere(`applicant.deleted_date IS NULL`);
      }

      if (recruiter) {
        builder.innerJoinAndSelect(
          'applicant.recruiters',
          'recruiter',
          'recruiter.id = :employee_id',
          { employee_id: recruiter },
        );
      } else {
        builder.leftJoinAndSelect(
          'applicant.recruiters',
          'recruiter',
          'recruiter.organization = :organization',
          { organization: haPcn.title },
        );
      }
      builder.andWhere(`status.status = 'Applicant Referred to ${haPcn.abbreviation}'`);
    } else if (status) {
      const status_list = await this.fetchChildStatusList(status);
      if (status_list.length > 0) {
        builder.andWhere('latest_status.id In(:...status_list)', { status_list });
      }
    }
    if (name) {
      searchNamesAndAts1Id(builder, ['applicant.name', 'applicant.ats1_id'], name);
    }

    if (sortKey === 'recruiter') {
      builder.orderBy(`recruiter.name`, order ?? 'DESC');
    } else {
      builder.orderBy(`applicant.${sortKey ?? 'updated_date'}`, order ?? 'DESC');
    }
    return builder.skip(skip).take(limit).getManyAndCount();
  }

  /** fetch all status if parent status passed */
  async fetchChildStatusList(status: string): Promise<string[]> {
    const categories = status.split(',');

    const statuses = await this.ienMasterService.ienApplicantStatusRepository.find({
      where: {
        category: In(categories),
      },
    });

    return statuses.map(({ id }) => id);
  }

  /**
   * Retrieve status object for given status ID
   * @param id
   * @returns Status Object or NotFoundException
   */
  async getStatusById(id: string): Promise<IENApplicantStatus> {
    const statusObj = await this.ienMasterService.ienApplicantStatusRepository.findOne(id);
    if (!statusObj) {
      throw new NotFoundException(`Status with given value "${id}" not found`);
    }

    return statusObj;
  }

  /**
   * Retrieve status object for given status name
   * @param status
   * @returns Status Object or NotFoundException
   */
  async getStatusByName(status: string): Promise<IENApplicantStatus> {
    const result = await this.ienMasterService.ienApplicantStatusRepository.findOne({ status });
    if (!result) {
      throw new NotFoundException(`Status with given value "${status}" not found`);
    }
    return result;
  }

  /**
   * Applicant information and Status Audit
   */

  /**
   *
   * @param applicant Applicant Object
   * @param added_by Passing it separately, In case of update we have to use updated_by field in place of added_by
   * @param manager
   */
  async saveApplicantAudit(applicant: IENApplicant, added_by: IENUsers, manager: EntityManager) {
    const dataToSave: object = applicant;

    const audit = this.ienapplicantAuditRepository.create({
      applicant: applicant,
      added_by: added_by,
      data: dataToSave,
    });
    await manager.save<IENApplicantAudit>(audit);
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
    manager: EntityManager,
  ): Promise<IENApplicantStatusAudit> {
    // Save
    const status: Partial<IENApplicantStatusAudit> = {
      applicant: applicant,
      job: job,
      ...dataToUpdate,
    };

    const status_audit = this.ienapplicantStatusAuditRepository.create(status);
    return manager.save<IENApplicantStatusAudit>(status_audit);
  }

  async getHaPcn(id: string): Promise<IENHaPcn> {
    const health_authority = await this.ienMasterService.ienHaPcnRepository.findOne(id);
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
    const users_data = await this.ienMasterService.ienUsersRepository.find({
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
  async getJob(id: string | number | undefined): Promise<IENApplicantJob | null> {
    if (!id) {
      return null;
    }
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
    const job_title = await this.ienMasterService.ienJobTitleRepository.findOne(id);
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
    const job_location = await this.ienMasterService.ienJobLocationRepository.findOne(id);
    if (!job_location) {
      throw new NotFoundException('Provided job location not found');
    }
    return job_location;
  }

  async getJobLocations(ids: number[]): Promise<IENJobLocation[] | []> {
    return this.ienMasterService.ienJobLocationRepository.findByIds(ids);
  }

  async updateLatestStatusOnApplicant(
    mappedApplicantList: string[],
    manager?: EntityManager,
  ): Promise<void> {
    try {
      const entityManager = manager ?? getManager();
      // update applicant with the latest status
      const idsToUpdate = `'${mappedApplicantList.join("','")}'`;
      const queryToUpdate = `
        UPDATE ien_applicants
        SET status_id = (
          SELECT status_id
          FROM ien_applicant_status_audit asa
          WHERE asa.applicant_id=ien_applicants.id
          ORDER BY asa.start_date DESC, asa.updated_date
          DESC limit 1
        )
        WHERE ien_applicants.id IN (${idsToUpdate})`;
      const result = await entityManager.query(queryToUpdate);
      this.logger.log(
        `applicants with the latest milestone updated: ${result[0].length}/${result[1]}`,
        'ATS-SYNC',
      );
    } catch (e) {
      this.logger.log(`Error in update latest status on applicant`, 'ATS-SYNC');
      this.logger.error(e);
    }
  }

  async getStatusReason(id: string): Promise<IENStatusReason> {
    const statusReason = await this.ienMasterService.ienStatusReasonRepository.findOne(id);
    if (!statusReason) {
      throw new NotFoundException('Provided Milestone/Status reason not found');
    }
    return statusReason;
  }
}
