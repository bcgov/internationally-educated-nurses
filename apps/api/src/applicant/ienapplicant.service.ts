/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FindManyOptions, getManager, In, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeRO, isAdmin, StatusCategory } from '@ien/common';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicant } from './entity/ienapplicant.entity';
import { IENUsers } from './entity/ienusers.entity';
import { IENApplicantFilterAPIDTO } from './dto/ienapplicant-filter.dto';
import { IENApplicantUtilService } from './ienapplicant.util.service';
import { CommonData } from 'src/common/common.data';
import { IENApplicantJob } from './entity/ienjob.entity';
import { IENApplicantStatusAudit } from './entity/ienapplicant-status-audit.entity';
import { IENJobLocation } from './entity/ienjoblocation.entity';
import {
  IENApplicantAddStatusAPIDTO,
  IENApplicantCreateUpdateAPIDTO,
  IENApplicantJobCreateUpdateAPIDTO,
  IENApplicantJobQueryDTO,
  IENApplicantUpdateStatusAPIDTO,
} from './dto';
import dayjs from 'dayjs';

@Injectable()
export class IENApplicantService {
  applicantRelations: any;
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @InjectRepository(IENApplicant)
    private readonly ienapplicantRepository: Repository<IENApplicant>,
    @InjectRepository(IENUsers)
    private readonly ienUsersRepository: Repository<IENUsers>,
    @Inject(IENApplicantUtilService)
    private readonly ienapplicantUtilService: IENApplicantUtilService,
    @InjectRepository(IENApplicantJob)
    private readonly ienapplicantJobRepository: Repository<IENApplicantJob>,
    @InjectRepository(IENApplicantStatusAudit)
    private readonly ienapplicantStatusAuditRepository: Repository<IENApplicantStatusAudit>,
  ) {
    this.applicantRelations = CommonData;
  }

  /**
   * List and filter applicants
   * @param filter accept filter for name, HA and status, and options for pagination
   * @returns
   */
  async getApplicants(
    filter: IENApplicantFilterAPIDTO,
    user: EmployeeRO,
  ): Promise<[data: IENApplicant[], count: number]> {
    return this.ienapplicantUtilService.applicantFilterQueryBuilder(filter, user?.ha_pcn_id);
  }

  /**
   * Retrieve applicant details, with audit and detail relational data
   * @param id
   * @param data Pass additinal relation, like audit,applicantaudit
   * @returns
   */
  async getApplicantById(id: string, data: any = null): Promise<IENApplicant> {
    let applicant;
    let relations = this.applicantRelations.status;
    let is_status_audit = false;
    try {
      if (data && data.relation && data.relation !== '') {
        const relations_array = data.relation.split(',');
        relations_array.forEach((rel: string) => {
          if (rel in this.applicantRelations && rel.trim() != '') {
            relations = relations.concat(this.applicantRelations[rel]);
            if (rel === 'audit') {
              is_status_audit = true;
            }
          }
        });
      }
      applicant = await this.ienapplicantRepository.findOne(id, { relations });
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e);
    }
    if (!applicant) {
      throw new NotFoundException(`Applicant with id '${id}' not found`);
    }
    if (is_status_audit) {
      applicant.applicant_status_audit = await this.ienapplicantStatusAuditRepository.find({
        where: { applicant, job: IsNull() },
        relations: ['status', 'reason', 'added_by', 'updated_by'],
      });
    }
    return applicant;
  }

  /**
   * Add new applicant
   * @param addApplicant Add Applicant DTO
   * @returns Created Applicant details
   */
  async addApplicant(
    addApplicant: IENApplicantCreateUpdateAPIDTO,
    user: EmployeeRO,
  ): Promise<IENApplicant | any> {
    const applicant = await this.createApplicantObject(addApplicant, user);

    await getManager().transaction(async manager => {
      await manager.save<IENApplicant>(applicant);
      await this.ienapplicantUtilService.saveApplicantAudit(applicant, applicant.added_by, manager);
    });
    return applicant;
  }

  /**
   * Create and return applicant Object, It can save single or in bulk
   * It is created to support addApplicant() function
   * @param addApplicant
   * @returns
   */
  async createApplicantObject(addApplicant: IENApplicantCreateUpdateAPIDTO, user: EmployeeRO) {
    const { assigned_to, first_name, last_name, email_address, country_of_citizenship, ...data } =
      addApplicant;
    const duplicate = await this.ienapplicantRepository.findOne({ email_address });
    if (duplicate) {
      throw new BadRequestException('There is already an applicant with this email.');
    }

    const applicant = this.ienapplicantRepository.create(data);
    const name: any = {
      ...applicant.additional_data,
      first_name: first_name,
      last_name: last_name,
    };

    if (country_of_citizenship && country_of_citizenship instanceof Array) {
      applicant.country_of_citizenship = country_of_citizenship;
    } else {
      applicant.country_of_citizenship = [`${country_of_citizenship}`];
    }
    applicant.additional_data = name;
    applicant.name = `${first_name} ${last_name}`;
    applicant.email_address = email_address;

    // collect assigned user details
    if (assigned_to && assigned_to instanceof Array && assigned_to.length) {
      applicant.assigned_to = await this.ienapplicantUtilService.getUserArray(assigned_to);
    }

    if (user?.user_id) {
      const added_by_data = await this.ienUsersRepository.findOne(user.user_id);
      if (added_by_data) {
        applicant.added_by = added_by_data;
      }
    }

    return applicant;
  }

  /**
   * It updated applicant info in syatem, It won't update status detail
   * @param id applicant IEN ID
   * @param applicantUpdate updated fields
   * @returns
   */
  async updateApplicantInfo(
    id: string,
    applicantUpdate: IENApplicantCreateUpdateAPIDTO,
  ): Promise<IENApplicant | any> {
    const applicant = await this.getApplicantById(id);
    const { assigned_to, first_name, last_name, country_of_citizenship, ...data } = applicantUpdate;
    if (country_of_citizenship) {
      if (country_of_citizenship instanceof Array) {
        applicant.country_of_citizenship = country_of_citizenship;
      } else {
        applicant.country_of_citizenship = [`${country_of_citizenship}`];
      }
    }
    if (first_name || last_name) {
      const name: any = {
        ...applicant.additional_data,
        first_name: first_name,
        last_name: last_name,
      };
      applicant.additional_data = name;
      applicant.name = `${first_name} ${last_name}`;
      delete data.additional_data;
    }
    if (data.additional_data === null) {
      delete data.additional_data;
    }
    if (assigned_to && assigned_to instanceof Array && assigned_to.length) {
      applicant.assigned_to = await this.ienapplicantUtilService.getUserArray(assigned_to);
    }
    await getManager().transaction(async manager => {
      await manager.update<IENApplicant>(IENApplicant, applicant.id, data);
      await manager.save<IENApplicant>(applicant);

      // audit changes
      await this.ienapplicantUtilService.saveApplicantAudit(
        applicant,
        applicant.updated_by,
        manager,
      );
    });

    return this.getApplicantById(id);
  }

  /**
   * Update status and audit it
   * @param user
   * @param id applicant IEN ID
   * @param milestone
   * @returns
   */
  async addApplicantStatus(
    user: EmployeeRO,
    id: string,
    milestone: IENApplicantAddStatusAPIDTO,
  ): Promise<IENApplicantStatusAudit | any> {
    const applicant = await this.getApplicantById(id);
    const { status, start_date, job_id, notes, reason, effective_date, reason_other } = milestone;
    const data: Partial<IENApplicantStatusAudit> = {};

    if (!status) {
      throw new BadRequestException(`Invalid milestone: id(${status})`);
    }

    /** Only allowing recruitment related milestones here */
    const statusDef = await this.ienapplicantUtilService.getStatusByName(status);
    if (!statusDef) {
      throw new BadRequestException(`Invalid milestone: id(${status})`);
    }

    if (!isAdmin(user) && statusDef.category != StatusCategory.RECRUITMENT) {
      throw new BadRequestException(
        `Only recruitment-related milestones/statuses are allowed here`,
      );
    }

    data.status = statusDef;

    const job = await this.ienapplicantUtilService.getJob(job_id);
    if (job && id !== job?.applicant.id) {
      throw new BadRequestException('Provided applicant and competition/job does not match');
    }

    if (data.status.category === StatusCategory.RECRUITMENT && !job) {
      throw new BadRequestException(`Competition/job are required to add a milestone`);
    }

    if (user?.user_id) {
      data.added_by = await this.ienUsersRepository.findOne(user.user_id);
    }

    if (reason) {
      data.reason = await this.ienapplicantUtilService.getStatusReason(reason);
    }

    data.reason_other = reason_other;

    data.start_date = start_date ? dayjs(start_date).toDate() : dayjs().toDate();

    data.effective_date = effective_date ? dayjs(effective_date).toDate() : undefined;

    data.notes = notes;
    data.type = milestone.type;

    let status_audit = null;

    await getManager().transaction(async manager => {
      status_audit = await this.ienapplicantUtilService.addApplicantStatusAudit(
        applicant,
        data,
        job,
        manager,
      );

      // Let's check and updated the latest status on applicant
      await this.ienapplicantUtilService.updateLatestStatusOnApplicant([applicant.id], manager);
      await manager.update<IENApplicant>(IENApplicant, status_audit.applicant.id, {
        updated_date: new Date(),
      });
      return status_audit;
    });
    return status_audit;
  }

  /**
   * Update applicant status record
   * @param user
   * @param status_id
   * @param milestone
   * @returns
   */
  async updateApplicantStatus(
    user: EmployeeRO,
    status_id: string,
    milestone: IENApplicantUpdateStatusAPIDTO,
  ): Promise<IENApplicantStatusAudit | any> {
    const audit = await this.ienapplicantStatusAuditRepository.findOne(status_id, {
      relations: ['applicant', 'added_by', 'status', 'job'],
    });
    if (!audit) {
      throw new NotFoundException('Provided status/milestone record not found');
    }
    const { status, start_date, effective_date, notes, reason, type } = milestone;
    if (user?.user_id) {
      const updated_by_data = await this.ienUsersRepository.findOne(user.user_id);
      if (updated_by_data) {
        audit.updated_by = updated_by_data;
      }
    }

    if (reason) {
      audit.reason = await this.ienapplicantUtilService.getStatusReason(reason);
    }

    if (status) {
      audit.status = await this.ienapplicantUtilService.getStatusByName(status);
    }

    if (start_date) {
      audit.start_date = dayjs(start_date).toDate();
    }

    if (effective_date) {
      audit.effective_date = dayjs(effective_date).toDate();
    }

    if (notes !== undefined) {
      audit.notes = notes;
    }

    audit.type = type;

    await getManager().transaction(async manager => {
      await manager.save<IENApplicantStatusAudit>(audit);
      await manager.update<IENApplicant>(IENApplicant, audit.applicant.id, {
        updated_date: new Date(),
      });

      // Let's check and updated the latest status on applicant
      await this.ienapplicantUtilService.updateLatestStatusOnApplicant(
        [audit.applicant.id],
        manager,
      );
    });

    return audit;
  }

  /**
   * Delete applicant status record
   * @param user_id Logged in user_id
   * @param status_id Applicant Audit status
   * @returns
   */
  async deleteApplicantStatus(user_id: string | null, status_id: string): Promise<void> {
    const status: IENApplicantStatusAudit | undefined =
      await this.ienapplicantStatusAuditRepository.findOne(status_id, {
        relations: ['applicant', 'added_by', 'status'],
      });

    if (!status) {
      throw new NotFoundException(`Applicant's selected milestone/status not found`);
    }
    if (user_id != status.added_by?.id) {
      throw new BadRequestException(`Requested milestone/status was added by different user`);
    }

    await getManager().transaction(async manager => {
      await manager.delete<IENApplicantStatusAudit>(IENApplicantStatusAudit, status_id);
      await manager.update<IENApplicant>(IENApplicant, status.applicant.id, {
        updated_date: new Date(),
      });
      await this.ienapplicantUtilService.updateLatestStatusOnApplicant(
        [status.applicant.id],
        manager,
      );
    });
  }

  /**
   * Add Job record for an applicant
   * @param user
   * @param id Applicant Id
   * @param jobData
   * @returns
   */
  async addApplicantJob(
    user: EmployeeRO,
    id: string,
    jobData: IENApplicantJobCreateUpdateAPIDTO,
  ): Promise<IENApplicantJob | undefined> {
    const applicant = await this.getApplicantById(id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ha_pcn, job_title, job_location, ...data } = jobData;
    const job = this.ienapplicantJobRepository.create(data);
    job.applicant = applicant;

    if (user?.user_id) {
      job.added_by = await this.ienUsersRepository.findOne(user.user_id);
    }

    return this.saveApplicantJob(job, jobData);
  }

  /**
   * Update applicant job data
   * @param id Job id fo an applicant
   * @param jobData
   * @returns
   */
  async updateApplicantJob(
    id: string,
    job_id: string,
    jobData: IENApplicantJobCreateUpdateAPIDTO,
  ): Promise<IENApplicantJob | undefined> {
    const job = await this.ienapplicantUtilService.getJob(job_id);
    if (job?.applicant.id !== id) {
      throw new BadRequestException(`Provided applicant and competition/job does not match)`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ha_pcn, job_title, job_location, ...data } = jobData;

    job.job_id = data.job_id;

    if (data.job_post_date) {
      job.job_post_date = data.job_post_date as any;
    }
    if (data.recruiter_name) {
      job.recruiter_name = data.recruiter_name;
    }
    await this.saveApplicantJob(job, jobData);
    return this.getApplicantJob(job_id);
  }

  /**
   * Delete applicant job
   * @param user_id id of user requesting deletion
   * @param job_id Job id to delete
   * @returns
   */
  async deleteApplicantJob(user_id: string | null, job_id: string): Promise<void> {
    const job: IENApplicantJob | undefined = await this.ienapplicantJobRepository.findOne(job_id, {
      relations: ['added_by', 'applicant'],
    });

    if (!job) {
      throw new NotFoundException(`Applicant job competition not found`);
    }
    if (user_id != job.added_by?.id) {
      throw new BadRequestException(`Requested job competition was added by different user`);
    }

    await getManager().transaction(async manager => {
      await manager.delete<IENApplicantJob>(IENApplicantJob, job_id);
      await this.ienapplicantUtilService.updateLatestStatusOnApplicant([job.applicant.id], manager);
    });
  }

  async getApplicantJob(job_id: string | number): Promise<IENApplicantJob | undefined> {
    return this.ienapplicantJobRepository.findOne(job_id, {
      relations: this.applicantRelations.applicant_job,
    });
  }

  /**
   * Save Job data
   */
  async saveApplicantJob(
    job: IENApplicantJob,
    jobData: IENApplicantJobCreateUpdateAPIDTO,
  ): Promise<IENApplicantJob | undefined> {
    const { ha_pcn, job_title, job_location } = jobData;
    job.ha_pcn = await this.ienapplicantUtilService.getHaPcn(ha_pcn);
    job.job_title = job_title ? await this.ienapplicantUtilService.getJobTitle(job_title) : null;
    job.job_location = job_location ? await this.fetchJobLocations(job_location) : null;
    await this.ienapplicantJobRepository.save(job);
    return job;
  }

  /**
   * Fetch all job_locations
   */
  async fetchJobLocations(locations: number[]): Promise<IENJobLocation[] | null> {
    const job_locations = await this.ienapplicantUtilService.getJobLocations(locations);
    if (job_locations.length) {
      return job_locations;
    }
    return null;
  }

  /**
   * Get applicant job details for recruitment process
   * @param id Applicant ID of IEN App
   * @param options filter and pagination options
   * @returns array of jobs and count
   */
  async getApplicantJobs(
    id: string,
    options: IENApplicantJobQueryDTO,
  ): Promise<[IENApplicantJob[], number]> {
    const { job_id, ha_pcn, job_title, skip, limit } = options;

    const where: any = { applicant: id };

    if (job_id) where.id = job_id;
    if (ha_pcn) where.ha_pcn = In(ha_pcn);
    if (job_title) where.job_title = In(job_title);

    const query: FindManyOptions<IENApplicantJob> = {
      where,
      order: {
        updated_date: 'DESC',
      },
      skip,
      take: limit,
      relations: this.applicantRelations.applicant_job,
    };
    return this.ienapplicantJobRepository.findAndCount(query);
  }
}
