/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicantCreateUpdateAPIDTO } from './dto/ienapplicant-create.dto';
import { IENApplicant } from './entity/ienapplicant.entity';
import { IENUsers } from './entity/ienusers.entity';
import { IENApplicantFilterAPIDTO } from './dto/ienapplicant-filter.dto';
import { IENApplicantAddStatusAPIDTO } from './dto/ienapplicant-add-status.dto';
import { IENApplicantUtilService } from './ienapplicant.util.service';
import { CommonData } from 'src/common/common.data';
import { IENApplicantJob } from './entity/ienjob.entity';
import { IENApplicantUpdateStatusAPIDTO } from './dto/ienapplicant-update-status.dto';
import { IENApplicantStatusAudit } from './entity/ienapplicant-status-audit.entity';
import { IENApplicantJobCreateUpdateAPIDTO } from './dto/ienapplicant-job-create.dto';

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
  ): Promise<[data: IENApplicant[], count: number]> {
    return await this.ienapplicantUtilService.applicantFilterQueryBuilder(filter);
  }

  /**
   * Retrive applicant details, with audit and detail relational data
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
        for (let i = 0; i < relations_array.length; i++) {
          if (relations_array[i] in this.applicantRelations && relations_array[i].trim() != '') {
            relations = relations.concat(this.applicantRelations[relations_array[i]]);
            if (relations_array[i] === 'audit') {
              is_status_audit = true;
            }
          }
        }
      }
      applicant = await this.ienapplicantRepository.findOne(id, {
        relations: relations,
      });
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e);
    }
    if (!applicant) {
      throw new NotFoundException(`Applicant with id '${id}' not found`);
    }
    if (is_status_audit) {
      applicant.applicant_status_audit = await this.ienapplicantStatusAuditRepository.find({
        where: {
          applicant: applicant,
          job: IsNull(),
        },
        relations: ['status', 'reason'],
      });
    }
    return applicant;
  }

  /**
   * Add new applicant
   * @param addApplicant Add Applicant DTO
   * @returns Created Applicant details
   */
  async addApplicant(addApplicant: IENApplicantCreateUpdateAPIDTO): Promise<IENApplicant | any> {
    const applicant = await this.createApplicantObject(addApplicant);
    await this.ienapplicantRepository.save(applicant);
    // let's save audit
    await this.ienapplicantUtilService.saveApplicantAudit(applicant, applicant.added_by);
    return applicant;
  }

  /**
   * Create and return applicant Object, It can save single or in bulk
   * It is created to support addApplicant() function
   * @param addApplicant
   * @returns
   */
  async createApplicantObject(addApplicant: IENApplicantCreateUpdateAPIDTO) {
    const {
      health_authorities,
      assigned_to,
      first_name,
      last_name,
      country_of_citizenship,
      ...data
    } = addApplicant;
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

    // collect HA/PCN
    if (health_authorities && health_authorities instanceof Array && health_authorities.length) {
      applicant.health_authorities = await this.ienapplicantUtilService.getHaPcns(
        health_authorities,
      );
    }
    // collect assigned user details
    if (assigned_to && assigned_to instanceof Array && assigned_to.length) {
      applicant.assigned_to = await this.ienapplicantUtilService.getUserArray(assigned_to);
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
    const {
      health_authorities,
      assigned_to,
      first_name,
      last_name,
      country_of_citizenship,
      ...data
    } = applicantUpdate;
    if (health_authorities && health_authorities instanceof Array && health_authorities.length) {
      applicant.health_authorities = await this.ienapplicantUtilService.getHaPcns(
        health_authorities,
      );
    }
    if (country_of_citizenship) {
      if (country_of_citizenship && country_of_citizenship instanceof Array) {
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
    await this.ienapplicantRepository.update(applicant.id, data);
    await this.ienapplicantRepository.save(applicant);

    // audit changes
    await this.ienapplicantUtilService.saveApplicantAudit(applicant, applicant.updated_by);
    return this.getApplicantById(id);
  }

  /**
   * Update staus and audit it
   * @param id applicant IEN ID
   * @param applicantUpdate updated fields only status and related field
   * @returns
   */
  async addApplicantStatus(
    id: string,
    applicantUpdate: IENApplicantAddStatusAPIDTO,
  ): Promise<IENApplicantStatusAudit | any> {
    const applicant = await this.getApplicantById(id);
    const { status, start_date, end_date, added_by, job_id, notes, reason } = applicantUpdate;
    const data: any = {};
    if (added_by) {
      const added_by_data = await this.ienUsersRepository.findOne(parseInt(added_by));
      if (added_by_data) {
        data.added_by = added_by_data;
      }
    }

    if (reason) {
      const statusReason = await this.ienapplicantUtilService.geStatustReason(+reason);
      data.reason = statusReason;
    }

    const status_obj = await this.ienapplicantUtilService.getStatusById(status);
    data.status = status_obj;

    data.start_date = null;
    if (start_date) {
      data.start_date = start_date;
    } else {
      data.start_date = new Date();
    }

    data.end_date = null;
    if (end_date) {
      data.start_date = end_date;
    }

    if (notes) {
      data.notes = notes;
    }

    let job = null;
    if (job_id) {
      job = await this.ienapplicantUtilService.getJob(job_id);
      if (id !== job.applicant.id) {
        throw new BadRequestException('Provided applicant and competition/job does not match');
      }
    }

    const status_audit = await this.ienapplicantUtilService.addApplicantStatusAudit(
      applicant,
      data,
      job,
    );
    /**
     * Note:
     * Based on scope we are only managing recruitment status.
     * For that we do need job/competition record,
     * So if that is exist we are updating previous status
     */
    if (job) {
      await this.ienapplicantUtilService.updatePreviousActiveStatusForJob(job, data);
    }

    // Let's check and updated latest status on applicant
    await this.ienapplicantUtilService.updateLatestStatusOnApplicant([applicant.id]);

    delete status_audit.applicant;
    return status_audit;
  }

  /**
   * Update applicant status record
   * @param status_id Applicant Audit status
   * @param applicantUpdate Status update data
   * @returns
   */
  async updateApplicantStatus(
    status_id: string,
    applicantUpdate: IENApplicantUpdateStatusAPIDTO,
  ): Promise<IENApplicantStatusAudit | any> {
    const status_audit = await this.ienapplicantStatusAuditRepository.findOne(status_id, {
      relations: ['applicant'],
    });
    if (!status_audit) {
      throw new NotFoundException('Provided status/milestone record not found');
    }
    const { status, start_date, end_date, added_by, notes, reason } = applicantUpdate;
    if (added_by) {
      const updated_by_data = await this.ienUsersRepository.findOne(parseInt(added_by));
      if (updated_by_data) {
        status_audit.updated_by = updated_by_data;
      }
    }

    if (reason) {
      const statusReason = await this.ienapplicantUtilService.geStatustReason(+reason);
      status_audit.reason = statusReason;
    }

    if (status) {
      const status_obj = await this.ienapplicantUtilService.getStatusById(status);
      status_audit.status = status_obj;
    }

    if (start_date) {
      status_audit.start_date = start_date;
    }

    if (end_date) {
      status_audit.end_date = end_date;
    }

    if (notes) {
      status_audit.notes = notes;
    }
    await this.ienapplicantStatusAuditRepository.save(status_audit);

    // Let's check and updated latest status on applicant
    await this.ienapplicantUtilService.updateLatestStatusOnApplicant([status_audit.applicant.id]);

    return status_audit;
  }

  /**
   * Add Job record for an applicant
   * @param id Applicant Id
   * @param jobData
   * @returns
   */
  async addApplicantJob(
    id: string,
    jobData: IENApplicantJobCreateUpdateAPIDTO,
  ): Promise<IENApplicantJob | undefined> {
    const applicant = await this.getApplicantById(id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ha_pcn, job_title, job_location, ...data } = jobData;
    const job = this.ienapplicantJobRepository.create(data);
    job.applicant = applicant;
    return await this.saveApplicantJob(job, jobData);
  }

  /**
   * Update applicant job data
   * @param id Job id fo an applicant
   * @param jobData
   * @returns
   */
  async updateApplicantJob(
    id: string,
    job_id: string | number,
    jobData: IENApplicantJobCreateUpdateAPIDTO,
  ): Promise<IENApplicantJob | undefined> {
    const job = await this.ienapplicantUtilService.getJob(job_id);
    if (job.applicant.id !== id) {
      throw new BadRequestException(`Provided applicant and competition/job does not match)`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ha_pcn, job_title, job_location, ...data } = jobData;
    if ('job_id' in data) {
      job.job_id = data.job_id;
    }
    if ('job_post_date' in data) {
      job.job_post_date = data.job_post_date;
    }
    if ('recruiter_name' in data) {
      job.recruiter_name = data.recruiter_name;
    }
    return await this.saveApplicantJob(job, jobData);
  }

  /**
   * Save Job data
   */
  async saveApplicantJob(
    job: IENApplicantJob,
    jobData: IENApplicantJobCreateUpdateAPIDTO,
  ): Promise<IENApplicantJob | undefined> {
    const { ha_pcn, job_title, job_location } = jobData;
    job.ha_pcn = await this.ienapplicantUtilService.getHaPcn(parseInt(ha_pcn));
    job.job_title = await this.ienapplicantUtilService.getJobTitle(job_title);
    job.job_location = await this.ienapplicantUtilService.getJobLocation(job_location);
    await this.ienapplicantJobRepository.save(job);
    return job;
  }

  /**
   * Get applicant job details for recruitment process
   * @param id Applicant ID of IEN App
   * @returns
   */
  async getApplicantJobs(id: string): Promise<IENApplicantJob[]> {
    const jobs = await this.ienapplicantJobRepository.find({
      where: {
        applicant: id,
      },
      relations: this.applicantRelations.applicant_job,
    });
    return jobs;
  }
}
