/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicantCreateAPIDTO } from './dto/ienapplicant-create.dto';
import { IENApplicant } from './entity/ienapplicant.entity';
import { IENHaPcn } from './entity/ienhapcn.entity';
import { IENUsers } from './entity/ienusers.entity';
import { IENApplicantFilterAPIDTO } from './dto/ienapplicant-filter.dto';
import { IENApplicantUpdateAPIDTO } from './dto/ienapplicant-update.dto';
import { IENApplicantUpdateStatusAPIDTO } from './dto/ienapplicant-update-status.dto';
import { IENApplicantUtilService } from './ienapplicant.util.service';
import { CommonData } from 'src/common/common.data';

@Injectable()
export class IENApplicantService {
  applicantRelations: any;
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @InjectRepository(IENApplicant)
    private readonly ienapplicantRepository: Repository<IENApplicant>,
    @InjectRepository(IENHaPcn)
    private readonly ienHaPcnRepository: Repository<IENHaPcn>,
    @InjectRepository(IENUsers)
    private readonly ienUsersRepository: Repository<IENUsers>,
    @Inject(IENApplicantUtilService)
    private readonly ienapplicantUtilService: IENApplicantUtilService,
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
    try {
      if (data && data.relation && data.relation !== '') {
        const relations_array = data.relation.split(',');
        for (let i = 0; i < relations_array.length; i++) {
          if (relations_array[i] in this.applicantRelations && relations_array[i].trim() != '') {
            relations = relations.concat(this.applicantRelations[relations_array[i]]);
          }
        }
      }
      applicant = await this.ienapplicantRepository.findOne(id, {
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
      applicant.ha_pcn = await this.getHaPcn(ha_pcn);
    }
    // collect assigned user details
    if (assigned_to && assigned_to.length) {
      const assigned = assigned_to.map(item => parseInt(item));
      applicant.assigned_to = await this.getUserArray(assigned);
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
      applicant.ha_pcn = await this.getHaPcn(ha_pcn);
    }
    if (assigned_to && assigned_to.length) {
      const assigned = assigned_to.map(item => parseInt(item));
      applicant.assigned_to = await this.getUserArray(assigned);
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
  async updateApplicantStatus(
    id: string,
    applicantUpdate: IENApplicantUpdateStatusAPIDTO,
  ): Promise<IENApplicant | any> {
    const applicant = await this.getApplicantById(id);
    const { status, status_date, added_by, ha_pcn } = applicantUpdate;
    const dataToUpdate: any = {};
    if (added_by) {
      const updated_by_data = await this.ienUsersRepository.findOne(parseInt(added_by));
      if (updated_by_data) {
        dataToUpdate.updated_by = updated_by_data;
      }
    }
    const status_obj = await this.ienapplicantUtilService.getStatusById(status);
    dataToUpdate.status = status_obj;

    if (!status_date) {
      dataToUpdate.status_date = new Date();
    } else {
      dataToUpdate.status_date = status_date;
    }
    let ha_pcn_obj = null;
    if (ha_pcn) {
      ha_pcn_obj = await this.getHaPcn([ha_pcn]);
      if (ha_pcn_obj.length) {
        ha_pcn_obj = ha_pcn_obj[0];
      }
    }

    await this.ienapplicantRepository.update(applicant.id, {
      ...dataToUpdate,
    });

    const applicant_obj = await this.getApplicantById(id);

    // let's audit changes
    await this.ienapplicantUtilService.updateApplicantStatusAudit(
      applicant_obj,
      dataToUpdate,
      ha_pcn_obj,
    );
    return applicant_obj;
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
      throw new NotFoundException('Provide all or some of HA not found');
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
      throw new NotFoundException('Provide all or some of Users not found');
    }
    return users_data;
  }
}
