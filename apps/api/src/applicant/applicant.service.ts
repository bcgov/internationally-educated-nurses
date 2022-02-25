/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IsNull, Not, Repository } from 'typeorm';
import { ApplicantFilterDto, ApplicantCreateDto } from '@ien/common';
import { ApplicantEntity } from './entity/applicant.entity';
import { ApplicantStatusEntity } from './entity/applicantStatus.entity';
import { ApplicantStatusAuditEntity } from './entity/applicantStatusAudit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppLogger } from 'src/common/logger.service';

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

  async addApplicant(addApplicantDto: ApplicantCreateDto): Promise<ApplicantEntity> {
    const { status, ...data } = addApplicantDto;
    const status_obj = await this.getApplicantStatusById(status);
    if (!data.is_open) {
      data.is_open = true;
    }
    const applicant = await this.saveAapplicant(data, status_obj);

    // let's add status in audit trail
    await this.saveStatusAudit(data, status_obj, applicant);

    return applicant;
  }

  async getApplicantStatusById(status: number): Promise<ApplicantStatusEntity | any> {
    const status_obj = this.applicantStatusRepository.findOne(status, {
      relations: ['parent'],
    });
    return status_obj;
  }

  async saveAapplicant(
    data: any,
    status_obj: ApplicantStatusEntity,
  ): Promise<ApplicantEntity | any> {
    if (!data.is_open) {
      data.is_open = true;
    }
    const applicant = this.applicantRepository.create({
      ...data,
      status: status_obj,
    });
    await this.applicantRepository.save(applicant);
    return applicant;
  }

  async getApplicantStatusAuditCount(where: any): Promise<number> {
    return await this.applicantStatusAuditRepository.count({
      where: where,
    });
  }

  async saveStatusAudit(
    data: any,
    status_obj: ApplicantStatusEntity,
    applicant: ApplicantEntity,
  ): Promise<void> {
    const { added_by, added_by_id } = data;
    if (!data.status_date) {
      data.status_date = new Date();
    }
    try {
      const status_audit = this.applicantStatusAuditRepository.create({
        applicant: applicant,
        status: status_obj,
        added_by: added_by,
        added_by_id: added_by_id,
        start_date: data.status_date,
      });
      await this.applicantStatusAuditRepository.save(status_audit);

      // Let's update existing status with end date.
      const where = {
        applicant: applicant,
        status: Not(status_obj),
        end_date: IsNull(),
      };
      const existingStatus = await this.getApplicantStatusAuditCount(where);
      if (existingStatus >= 0) {
        const updateData = {
          updated_by: added_by,
          updated_by_id: added_by_id,
          end_date: data.status_date,
        };
        await this.applicantStatusAuditRepository.update(where, updateData);
      }
    } catch (e) {
      this.logger.error(e);
    }
  }
}
