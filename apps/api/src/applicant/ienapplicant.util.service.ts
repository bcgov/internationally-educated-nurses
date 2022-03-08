/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { In, IsNull, Repository, ILike, Not } from 'typeorm';
import { ApplicantStatusEntity } from './entity/applicantStatus.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicantStatus } from './entity/ienapplicant-status.entity';
import { IENApplicant } from './entity/ienapplicant.entity';
import { IENApplicantFilterAPIDTO } from './dto/ienapplicant-filter.dto';
import { IENApplicantAudit } from './entity/ienapplicant-audit.entity';
import { IENApplicantStatusAudit } from './entity/ienapplicant-status-audit.entity';
import { CommonData } from 'src/common/common.data';

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
  async getStatusById(status: string): Promise<ApplicantStatusEntity | any> {
    const statusObj = await this.ienapplicantStatusRepository.findOne(parseInt(status), {
      relations: ['parent'],
    });
    if (!statusObj) {
      throw new NotFoundException(`Status with give value "${status}" not found`);
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
   * Store applicant status audit details
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
      if (applicant.ha_pcn?.length) {
        const save_ha_audit = [];
        for (let i = 0; i < applicant.ha_pcn.length; i++) {
          save_ha_audit.push(
            this.ienapplicantStatusAuditRepository.create({
              ha_pcn: applicant.ha_pcn[i],
              ...dataToSave,
            }),
          );
        }
        await this.ienapplicantStatusAuditRepository.save(save_ha_audit);
      } else {
        const status_audit = this.ienapplicantStatusAuditRepository.create(dataToSave);
        await this.ienapplicantStatusAuditRepository.save(status_audit);
      }
    } catch (e) {}
  }

  /**
   * Add new status
   * Find old status that has end-date null and update it.
   * If HA provided then update old status end date(like match with HA or Ha should be null)
   * @param applicant
   * @param dataToUpdate
   * @param ha_pcn_obj
   */
  async updateApplicantStatusAudit(
    applicant: IENApplicant,
    dataToUpdate: any,
    ha_pcn_obj: any,
  ): Promise<void> {
    // Save
    const statusAudit = this.ienapplicantStatusAuditRepository.create({
      applicant: applicant,
      status: applicant.status,
      added_by: applicant.updated_by,
      start_date: applicant.status_date,
      ha_pcn: ha_pcn_obj,
    });
    await this.ienapplicantStatusAuditRepository.save(statusAudit);

    // add end-date in previous status
    if (ha_pcn_obj) {
      const listToUpdate = await this.ienapplicantStatusAuditRepository.find({
        where: [
          {
            applicant: applicant,
            status: Not(dataToUpdate.status.id),
            end_date: IsNull(),
            ha_pcn: IsNull(),
          },
          {
            applicant: applicant,
            status: Not(dataToUpdate.status.id),
            end_date: IsNull(),
            ha_pcn: ha_pcn_obj.id,
          },
        ],
      });
      if (listToUpdate.length >= 0) {
        const updateData = {
          updated_by: dataToUpdate.updated_by,
          end_date: dataToUpdate.status_date,
        };
        const listSta: IENApplicantStatusAudit[] = [];
        for (let i = 0; i < listToUpdate.length; i++) {
          listSta.push({
            ...listToUpdate[i],
            ...updateData,
            status_period: 0, // added for entity restriction error
          });
        }
        this.ienapplicantStatusAuditRepository.save(listSta);
      }
    }
  }
}
