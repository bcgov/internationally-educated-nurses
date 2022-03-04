/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { In, IsNull, Not, Raw, Repository, ILike } from 'typeorm';
import { ApplicantEntity } from './entity/applicant.entity';
import { ApplicantStatusEntity } from './entity/applicantStatus.entity';
import { ApplicantStatusAuditEntity } from './entity/applicantStatusAudit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppLogger } from 'src/common/logger.service';
import { ApplicantAuditEntity } from './entity/applicantAudit.entity';
import { ApplicantCreateAPIDTO } from './dto/applicant-create.dto';
import { ApplicantFilterAPIDTO } from './dto/applicant-filter.dto';
import { ApplicantUpdateAPIDTO } from './dto/applicant-update.dto';

@Injectable()
export class ApplicantService {
  applicantRelations: any;
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @InjectRepository(ApplicantEntity)
    private readonly applicantRepository: Repository<ApplicantEntity>,
    @InjectRepository(ApplicantStatusEntity)
    private readonly applicantStatusRepository: Repository<ApplicantStatusEntity>,
    @InjectRepository(ApplicantStatusAuditEntity)
    private readonly applicantStatusAuditRepository: Repository<ApplicantStatusAuditEntity>,
    @InjectRepository(ApplicantAuditEntity)
    private readonly applicantAuditRepository: Repository<ApplicantAuditEntity>,
  ) {
    this.applicantRelations = {
      status: ['status', 'status.parent'],
      audit: ['applicant_status_audit', 'applicant_status_audit.status', 'applicant_audit'],
    };
  }

  async getApplicants(filter: ApplicantFilterAPIDTO): Promise<ApplicantEntity[]> {
    return await this.applicantRepository.find({
      where: this.applicantFilterQueryBuilder(filter),
      order: {
        updated_date: 'DESC',
      },
      relations: this.applicantRelations.status,
    });
  }

  async getApplicantById(id: string, data: any = null): Promise<ApplicantEntity> {
    let applicant;
    let relations = this.applicantRelations.status;
    try {
      if (data && data.relation && data.relation !== '' && data.relation === 'audit') {
        relations = relations.concat(this.applicantRelations.audit);
      }
      applicant = await this.applicantRepository.findOne(id, {
        relations: relations,
      });
    } catch (e) {
      this.logger.error(e);
      throw new NotFoundException(`Applicant with id '${id}' not found`);
    }
    if (!applicant) {
      throw new NotFoundException(`Applicant with id '${id}' not found`);
    }
    return applicant;
  }

  async addApplicant(addApplicant: ApplicantCreateAPIDTO): Promise<ApplicantEntity | any> {
    const { status, ...data } = addApplicant;
    // try {
    const statusObj = await this.getApplicantStatusById(status);
    const applicant: ApplicantEntity = await this.saveApplicant(data, statusObj);
    return applicant;
    // } catch (e) {
    //   this.logger.error(e);
    // }
  }

  async updateApplicant(
    id: string,
    applicantUpdate: ApplicantUpdateAPIDTO,
  ): Promise<ApplicantEntity | any> {
    const applicant = await this.getApplicantById(id);
    const { status, ...data } = applicantUpdate;
    let statusObj;
    const dataToUpdate: any = data;

    if (status && status !== applicant.status.status) {
      statusObj = await this.getApplicantStatusById(status);
      dataToUpdate.status = statusObj;
    }
    try {
      await this.applicantRepository.update(applicant.id, dataToUpdate);

      // Let's audit changes in separate tables
      if (status && status !== applicant.status.status) {
        applicantUpdate.status = statusObj;
        await this.saveStatusAudit(applicantUpdate, statusObj, applicant);
      }
      await this.saveApplicantAudit(applicant, applicantUpdate);
      return await this.getApplicantById(id);
    } catch (e) {
      this.logger.error(e);
    }
  }

  /**
   * Saving applicants as part of bulk insert.
   * TODO: Need to enable upsert when get some unique-id from imported file
   * @param applicants Array of applicants
   */
  async createBulkApplicants(applicants: ApplicantCreateAPIDTO[]): Promise<ApplicantEntity[]> {
    if (!applicants.length) {
      throw new BadRequestException('Minimum one applicant data required');
    }
    const allStatus = await this.fetchAllStatus();
    const mappedApplicants: any = applicants.map(item => {
      item.status = allStatus[item.status];
      return item;
    });
    const savedApplicants = await this.applicantRepository.insert(mappedApplicants);
    return savedApplicants.raw;
  }

  /** Support methods for above functions */
  /**
   * Get status object from statusId
   */
  async getApplicantStatusById(status: string): Promise<ApplicantStatusEntity | any> {
    const statusObj = await this.applicantStatusRepository.findOne(
      { status: status },
      {
        relations: ['parent'],
      },
    );
    if (!statusObj) {
      throw new NotFoundException(`Status with give value "${status}" not found`);
    }
    return statusObj;
  }

  /**
   * Add new applicant data in database table applicant data
   * @param data Applicant DTO
   * @param statusObj Applicant status Object
   * @returns Applicant or Not Found
   */
  async saveApplicant(data: any, statusObj: ApplicantStatusEntity): Promise<ApplicantEntity | any> {
    const applicant = this.applicantRepository.create({
      ...data,
      status: statusObj,
    });
    await this.applicantRepository.save(applicant);
    return applicant;
  }

  async getApplicantStatusAudit(where: any): Promise<ApplicantStatusAuditEntity[]> {
    return await this.applicantStatusAuditRepository.find({
      where: where,
    });
  }

  /**
   * It saves new status, also update end-date and updated-by in previous actives tatus.
   * It keeps a track of all status update for given applicant.
   * @param data Applicant Data
   * @param statusObj Applicant status object
   * @param applicant Applicant Object
   */
  async saveStatusAudit(
    data: any,
    statusObj: ApplicantStatusEntity,
    applicant: ApplicantEntity,
  ): Promise<void> {
    const { added_by, added_by_id } = data;
    if (!data.status_date) {
      data.status_date = new Date();
    }
    try {
      const statusAudit = this.applicantStatusAuditRepository.create({
        applicant: applicant,
        status: statusObj,
        added_by: added_by,
        added_by_id: added_by_id,
        start_date: data.status_date,
      });
      await this.applicantStatusAuditRepository.save(statusAudit);

      // Let's update existing status with end date.
      const where = {
        applicant: applicant,
        status: Not(statusObj.id),
        end_date: IsNull(),
      };
      const existingStatus: ApplicantStatusAuditEntity[] = await this.getApplicantStatusAudit(
        where,
      );
      // In best case scenario there is only one record here
      // Let's not put hard limit right now.
      if (existingStatus.length >= 0) {
        const updateData = {
          updated_by: added_by,
          updated_by_id: added_by_id,
          end_date: data.status_date,
        };
        const listSta: ApplicantStatusAuditEntity[] = [];
        for (let i = 0; i < existingStatus.length; i++) {
          listSta.push({
            ...existingStatus[i],
            ...updateData,
            status_period: 0, // added for entity restriction error
          });
        }
        this.applicantStatusAuditRepository.save(listSta);
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  /**
   * It stores update applicant activity.
   * @param applicant Applicant object
   * @param data Data object received from the frontend
   */
  async saveApplicantAudit(applicant: ApplicantEntity, data: any): Promise<void> {
    const { added_by, added_by_id, ...dataToSave } = data;
    try {
      const applicantAudit = this.applicantAuditRepository.create({
        applicant: applicant,
        data: dataToSave,
        added_by: added_by,
        added_by_id: added_by_id,
      });
      await this.applicantAuditRepository.save(applicantAudit);
    } catch (e) {
      this.logger.error(e);
    }
  }

  /**
   * Build a query using given attributes of applicant table
   * @param filter
   * @returns 'where' query that support find() method
   */
  applicantFilterQueryBuilder(filter: ApplicantFilterAPIDTO) {
    let where: any = {};
    if (filter) {
      const { ha_pcn, name, status } = filter;
      if (ha_pcn) {
        const hapcn = ha_pcn.split(',');
        where.ha_pcn = Raw(alias => `UPPER(${alias}) IN (:...hapcn)`, {
          hapcn: hapcn,
        });
      }
      if (name) {
        where = [
          { first_name: ILike(`%${name}%`), ...where },
          { last_name: ILike(`%${name}%`), ...where },
        ];
      }
      if (status) {
        const statusArray: any = status
          .split(',')
          .filter(x => x.trim() !== '')
          .map(Number)
          .filter(x => !isNaN(x));
        if (where instanceof Array) {
          const tempWhere = [];
          for (let i = 0; i < where.length; i++) {
            tempWhere.push({ status: In(statusArray), ...where[i] });
            tempWhere.push({ status: { parent: In(statusArray) }, ...where[i] });
          }
          where = tempWhere;
        } else {
          where = [
            { status: In(statusArray), ...where },
            { status: { parent: In(statusArray) }, ...where },
          ];
        }
      }
    }
    return where;
  }

  /** Fetch all status to reduce database calls to bulk upload applicants(status relations) */
  async fetchAllStatus() {
    const status = await this.applicantStatusRepository.find();
    const keyStatus: any = {};
    for (let i = 0; i < status.length; i++) {
      keyStatus[status[i].id] = status[i];
    }
    return keyStatus;
  }
}
