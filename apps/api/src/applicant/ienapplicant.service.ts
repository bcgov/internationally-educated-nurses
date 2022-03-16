/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicantCreateAPIDTO } from './dto/ienapplicant-create.dto';
import { IENApplicant } from './entity/ienapplicant.entity';
import { IENUsers } from './entity/ienusers.entity';
import { IENApplicantFilterAPIDTO } from './dto/ienapplicant-filter.dto';
import { IENApplicantUpdateAPIDTO } from './dto/ienapplicant-update.dto';
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
   * @param filter accept filter for name, HA and status
   * @returns
   */
  async getApplicants(filter: IENApplicantFilterAPIDTO): Promise<IENApplicant[]> {
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
        relations: ['status'],
      });
    }
    return applicant;
  }

  /**
   * Add new applicant
   * @param addApplicant Add Applicant DTO
   * @returns Created Applicant details
   */
  async addApplicant(addApplicant: IENApplicantCreateAPIDTO): Promise<IENApplicant | any> {
    const applicant = await this.createApplicantObject(addApplicant);
    await this.ienapplicantRepository.save(applicant);
    // let's save audit
    await this.ienapplicantUtilService.saveApplicantAudit(applicant, applicant.added_by);
    await this.ienapplicantUtilService.saveApplicantStatusAudit(applicant);
    return applicant;
  }

  /**
   * Create and return applicant Object, It can save single or in bulk
   * It is created to support addApplicant() function
   * @param addApplicant
   * @returns
   */
  async createApplicantObject(addApplicant: IENApplicantCreateAPIDTO) {
    const { status, ha_pcn, assigned_to, added_by, ...data } = addApplicant;
    const applicant = this.ienapplicantRepository.create(data);
    // collect status
    const status_obj = await this.ienapplicantUtilService.getStatusById(status);
    applicant.status = status_obj;

    // collect HA/PCN
    if (ha_pcn && ha_pcn.length) {
      applicant.ha_pcn = await this.ienapplicantUtilService.getHaPcn(ha_pcn);
    }
    // collect assigned user details
    if (assigned_to && assigned_to.length) {
      const assigned = assigned_to.map(item => parseInt(item));
      applicant.assigned_to = await this.ienapplicantUtilService.getUserArray(assigned);
    }
    // collect added by user detail
    if (added_by) {
      const added_by_data = await this.ienUsersRepository.findOne(parseInt(added_by));
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
    applicantUpdate: IENApplicantUpdateAPIDTO,
  ): Promise<IENApplicant | any> {
    const applicant = await this.getApplicantById(id);
    const { ha_pcn, assigned_to, updated_by, ...data } = applicantUpdate;
    if (ha_pcn && ha_pcn.length) {
      applicant.ha_pcn = await this.ienapplicantUtilService.getHaPcn(ha_pcn);
    }
    if (assigned_to && assigned_to.length) {
      const assigned = assigned_to.map(item => parseInt(item));
      applicant.assigned_to = await this.ienapplicantUtilService.getUserArray(assigned);
    }
    if (updated_by) {
      const updated_by_data = await this.ienUsersRepository.findOne(parseInt(updated_by));
      if (updated_by_data) {
        applicant.updated_by = updated_by_data;
      }
    }
    await this.ienapplicantRepository.save(applicant);
    await this.ienapplicantRepository.update(applicant.id, data); // updated date needs to modify with MtoM relation

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
  ): Promise<IENApplicant | any> {
    const applicant = await this.getApplicantById(id);
    const { status, start_date, end_date, added_by, job_id } = applicantUpdate;
    const dataToUpdate: any = {};
    if (added_by) {
      const updated_by_data = await this.ienUsersRepository.findOne(parseInt(added_by));
      if (updated_by_data) {
        dataToUpdate.updated_by = updated_by_data;
      }
    }

    const status_obj = await this.ienapplicantUtilService.getStatusById(status);
    dataToUpdate.status = status_obj;

    dataToUpdate.start_date = null;
    if (start_date) {
      dataToUpdate.start_date = start_date;
    }

    dataToUpdate.end_date = null;
    if (end_date) {
      dataToUpdate.start_date = end_date;
    }

    let job = null;
    if (job_id) {
      job = await this.ienapplicantUtilService.getJob(job_id);
    }

    // let's audit changes
    await this.ienapplicantUtilService.addApplicantStatusAudit(applicant, dataToUpdate, job);
    const applicant_obj = await this.getApplicantById(id);
    return applicant_obj;
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
    const status_audit = await this.ienapplicantStatusAuditRepository.findOne(status_id);
    if (!status_audit) {
      throw new NotFoundException('Provided status/ toupdate record is not found');
    }
    const { status, start_date, end_date, added_by } = applicantUpdate;
    if (added_by) {
      const updated_by_data = await this.ienUsersRepository.findOne(parseInt(added_by));
      if (updated_by_data) {
        status_audit.updated_by = updated_by_data;
      }
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
    await this.ienapplicantStatusAuditRepository.save(status_audit);
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
    jobData: IENApplicantJobCreateUpdateAPIDTO,
  ): Promise<IENApplicantJob | undefined> {
    const job = await this.ienapplicantJobRepository.findOne(id);
    if (!job) {
      throw new NotFoundException('Given Job Id not found');
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
    const ha_pcn_obj = await this.ienapplicantUtilService.getHaPcn([ha_pcn]);
    job.ha_pcn = ha_pcn_obj[0];
    job.job_title = await this.ienapplicantUtilService.getJobTitle(job_title);
    job.job_location = await this.ienapplicantUtilService.getJobLocation(job_location);
    await this.ienapplicantJobRepository.save(job);
    return job;
  }
}
