/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IsNull, Not, Repository } from 'typeorm';
import { ApplicantFilterDto, ApplicantCreateDto, ApplicantUpdateDto } from '@ien/common';
import { ApplicantEntity } from './entity/applicant.entity';
import { ApplicantStatusEntity } from './entity/applicantStatus.entity';
import { ApplicantStatusAuditEntity } from './entity/applicantStatusAudit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppLogger } from 'src/common/logger.service';
import { ApplicantAuditEntity } from './entity/applicantAudit.entity';

@Injectable()
export class ApplicantService {
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
  ) {}

  async getApplicants(filterDto: ApplicantFilterDto): Promise<ApplicantEntity[]> {
    let where: any = {};
    const { ha_pcn, status } = filterDto;
    if (filterDto) {
      if (ha_pcn) {
        where.ha_pcn = ha_pcn;
      }
      if (status) {
        where = [
          { status: parseInt(status), ...where },
          { status: { parent: parseInt(status) }, ...where },
        ];
      }
    }

    return await this.applicantRepository.find({
      where: where,
      order: {
        updated_date: 'DESC',
      },
      relations: ['status', 'status.parent'],
    });
  }

  async getApplicantById(id: string): Promise<ApplicantEntity> {
    let applicant;
    try {
      applicant = await this.applicantRepository.findOne(id, {
        relations: ['status', 'status.parent'],
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

  async addApplicant(addApplicantDto: ApplicantCreateDto): Promise<ApplicantEntity | any> {
    const { status, ...data } = addApplicantDto;
    try {
      const status_obj = await this.getApplicantStatusById(status);
      const applicant: ApplicantEntity = await this.saveAapplicant(data, status_obj);

      // let's add status in audit trail
      await this.saveStatusAudit(data, status_obj, applicant);
      await this.saveApplicantAudit(applicant, applicant);

      return applicant;
    } catch (e) {
      this.logger.error(e);
    }
  }

  async updateApplicant(
    id: string,
    applicantUpdate: ApplicantUpdateDto,
  ): Promise<ApplicantEntity | any> {
    const applicant = await this.getApplicantById(id);
    const { status, ...data } = applicantUpdate;
    let statusObj;
    const dataToUpdate: any = data;
    try {
      if (status && status !== applicant.status.id) {
        statusObj = await this.getApplicantStatusById(status);
        dataToUpdate.status = statusObj;
      }
      delete dataToUpdate.status_date;
      delete dataToUpdate.added_by;
      delete dataToUpdate.added_by_id;
      await this.applicantRepository.update(applicant.id, dataToUpdate);

      // Let's audit changes in separate tables
      if (status && status !== applicant.status.id) {
        applicantUpdate.status = statusObj;
        await this.saveStatusAudit(applicantUpdate, statusObj, applicant);
      }
      await this.saveApplicantAudit(applicant, applicantUpdate);
      return await this.getApplicantById(id);
    } catch (e) {
      this.logger.error(e);
    }
  }

  /** Support methods for above functions */
  /**
   * Get status object from statusId
   */
  async getApplicantStatusById(status: number): Promise<ApplicantStatusEntity | any> {
    const status_obj = this.applicantStatusRepository.findOne(status, {
      relations: ['parent'],
    });
    return status_obj;
  }

  /**
   * Add new applicant data in database table applicant data
   * @param data Applicant DTO
   * @param statusObj Applicant status Object
   * @returns Applicant or Not Found
   */
  async saveAapplicant(
    data: any,
    statusObj: ApplicantStatusEntity,
  ): Promise<ApplicantEntity | any> {
    if (!data.is_open) {
      data.is_open = true;
    }
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
            status_period: 0,
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
}
