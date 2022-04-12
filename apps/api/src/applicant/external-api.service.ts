/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ExternalRequest } from 'src/common/external-request';
import { InjectRepository } from '@nestjs/typeorm';
import { IENHaPcn } from './entity/ienhapcn.entity';
import { getManager, In, Repository } from 'typeorm';
import { IENUsers } from './entity/ienusers.entity';
import { IENStatusReason } from './entity/ienstatus-reason.entity';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicant } from './entity/ienapplicant.entity';
import { IENApplicantStatus } from './entity/ienapplicant-status.entity';
import { getMilestoneCategory } from 'src/common/util';
import { IENApplicantStatusAudit } from './entity/ienapplicant-status-audit.entity';

@Injectable()
export class ExternalAPIService {
  applicantRelations: any;
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @Inject(ExternalRequest) private readonly external_request: ExternalRequest,
    @InjectRepository(IENHaPcn)
    private readonly ienHaPcnRepository: Repository<IENHaPcn>,
    @InjectRepository(IENUsers)
    private readonly ienUsersRepository: Repository<IENUsers>,
    @InjectRepository(IENStatusReason)
    private readonly ienStatusReasonRepository: Repository<IENStatusReason>,
    @InjectRepository(IENApplicant)
    private readonly ienapplicantRepository: Repository<IENApplicant>,
    @InjectRepository(IENApplicantStatus)
    private readonly ienApplicantStatusRepository: Repository<IENApplicantStatus>,
    @InjectRepository(IENApplicantStatusAudit)
    private readonly ienapplicantStatusAuditRepository: Repository<IENApplicantStatusAudit>,
  ) {}

  /**
   * Save all data for master tables.
   */
  async saveData() {
    const ha = this.saveHa();
    const users = this.saveUsers();
    const reasons = this.saveReasons();
    const milestones = this.saveMilestones();

    await Promise.all([ha, users, reasons, milestones]).then(res => {
      this.logger.log(`Response: ${res}`);
      this.logger.log(`Master tables imported at ${new Date()}`);
    });
  }

  /**
   * All data has one unique column(for the upsert),
   * which is replicate and reflact multipletime in received array,
   * Here if the same id occured we wil use most recent value of it and update it in our database,
   * Due to this cleanup upsert transaction works fine.
   * Update: 31-March-2022, Received correct data so commenting this function out for now
   * @param data Data array
   */
  _cleanData(data: string | any[], uniquecolumn: string) {
    const keys: any = {};
    for (let i = 0; i < data.length; i++) {
      keys[data[i][uniquecolumn]] = data[i];
    }
    data = [];
    for (const [key] of Object.entries(keys)) {
      data.push(keys[key]);
    }
    return data;
  }

  /**
   * Collect HealthAuthorities data from <domain>/HealthAuthority Url.
   * and Save in ien_ha_pcn table in database for applicant reference.
   */
  async saveHa(): Promise<void> {
    try {
      const data = await this.external_request.getHa();
      if (Array.isArray(data)) {
        const listHa = data.map((item: { title: string; name: any }) => {
          item.title = item.name;
          delete item.name;
          return item;
        });
        await this.ienHaPcnRepository.upsert(listHa, ['id']);
      }
    } catch (e) {
      this.logger.log(`Error in saveHa(): ${e}`);
    }
  }

  /**
   * Collect Staff/User data from <domain>/staff Url.
   * and Save in ien_users table in database for applicant reference.
   */
  async saveUsers(): Promise<void> {
    try {
      const data = await this.external_request.getStaff();
      if (Array.isArray(data)) {
        await this.ienUsersRepository.upsert(data, ['id']);
      }
    } catch (e) {
      this.logger.log(`Error in saveUsers(): ${e}`);
    }
  }

  /**
   * Collect Milestone reason data from <domain>/Reason Url.
   * and Save in ien_status_reasons table in database for milestone/status reference.
   */
  async saveReasons(): Promise<void> {
    try {
      const data = await this.external_request.getReason();
      if (Array.isArray(data)) {
        await this.ienStatusReasonRepository.upsert(data, ['id']);
      }
    } catch (e) {
      this.logger.log(`Error in saveReasons(): ${e}`);
    }
  }

  /**
   * Let's clean and map status/milestone object with existing schema
   * and upsert it.
   */
  async saveMilestones(): Promise<void> {
    try {
      const data = await this.external_request.getMilestone();
      if (Array.isArray(data)) {
        await this.ienApplicantStatusRepository.upsert(this.cleanAndFilterMilestone(data), ['id']);
      }
    } catch (e) {
      this.logger.log(`Error in saveReasons(): ${e}`);
    }
  }

  cleanAndFilterMilestone(data: any) {
    return data.reduce(
      (
        filtered: { parent: number; id: string | number; status: string; party: string }[],
        item: { category: string; id: string | number; name: string; party: string },
      ) => {
        const category = getMilestoneCategory(item.category);
        if (category && category !== 10003) {
          filtered.push({
            id: item.id,
            status: item.name,
            party: item.party,
            parent: category,
          });
        }
        return filtered;
      },
      [],
    );
  }

  /**
   * fetch and upsert applicant details
   */
  async saveApplicant(): Promise<void> {
    try {
      const data = await this.external_request.getApplicants();
      await this.createBulkApplicants(data);
    } catch (e) {
      this.logger.error(e);
    }
  }

  /**
   * fet user/staff and HA details to reduce database calls.
   * @returns
   */
  async getApplicantMasterData() {
    // fetch user/staff details
    const usersArray = await this.ienUsersRepository.find();
    const users: any = {};
    usersArray.forEach(user => {
      users[user.id] = user;
    });
    // Fetch Health Authorities
    const haArray = await this.ienHaPcnRepository.find();
    const ha: any = {};
    haArray.forEach(ha_obj => {
      ha[ha_obj.id] = ha_obj;
    });
    return { users: users, ha: ha };
  }

  /**
   * Clean raw data and save applicant info into 'ien_applicant' table.
   * @param data Raw Applicant data
   */
  async createBulkApplicants(data: any) {
    // upsert applicant list first
    if (!Array.isArray(data)) {
      this.logger.error(`Applicant data error:`, data);
      return;
    }
    const applicants = await this.mapApplicants(data);
    if (applicants.length > 0) {
      const processed_applicant = await this.ienapplicantRepository.upsert(applicants, [
        'applicant_id',
      ]);
      this.logger.log(`processed_applicant`);
      this.logger.log(processed_applicant.raw);
      const mappedApplicantList = processed_applicant?.raw.map((item: { id: string | number }) => {
        return item.id;
      });

      // Upsert milestones
      const milestones = await this.mapMilestones(data, mappedApplicantList);
      if (milestones.length > 0) {
        try {
          const updatedstatus = await this.ienapplicantStatusAuditRepository
            .createQueryBuilder()
            .insert()
            .into(IENApplicantStatusAudit)
            .values(milestones)
            .orIgnore(`("status_id", "applicant_id", "start_date") WHERE job_id IS NULL`)
            .execute();
          this.logger.log(`updatedstatus`);
          this.logger.log(updatedstatus.raw);
        } catch (e) {
          this.logger.log(`milestone upsert`);
          this.logger.error(e);
        }
      }

      // update applicant with latest status
      const updatedApplicants = await getManager().query(
        `UPDATE ien_applicants SET status_id = (SELECT status_id FROM ien_applicant_status_audit asa WHERE asa.applicant_id=ien_applicants.id ORDER BY asa.start_date DESC limit 1)`,
      );
      this.logger.log({ updatedApplicants });
    } else {
      this.logger.log(`No applicants received today`);
    }
  }

  /**
   * Map raw data with existing applicant schema
   * @param data raw applicant data
   * @returns object that use in upsert applicants
   */
  async mapApplicants(data: any) {
    const { users, ha } = await this.getApplicantMasterData();
    return data.map(
      (a: {
        health_authorities: { title: string; id: number | string }[] | undefined;
        assigned_to: { id: string | number; name: string }[] | undefined;
        registration_date: string;
        applicant_id: string | number;
        first_name: string;
        last_name: string;
        email_address: string;
        phone_number: string;
        country_of_citizenship: string[] | string;
        country_of_residence: string;
        bccnm_license_number: string;
        pr_status: string;
        nursing_educations: any;
        notes: any;
      }) => {
        let health_authorities = null;
        if (a.health_authorities && a.health_authorities != undefined) {
          health_authorities = a.health_authorities.map(
            (h: { title: string; id: number | string }) => {
              h.title = ha[`${h.id}`].title;
              return h;
            },
          );
        }

        let assigned_to = null;
        if (a.assigned_to && a.assigned_to != undefined) {
          assigned_to = a.assigned_to.map((user: { id: string | number; name: string }) => {
            user.name = users[user.id].name;
            return user;
          });
        }

        let citizenship = null;
        if (a.country_of_citizenship && Array.isArray(a.country_of_citizenship)) {
          citizenship = a.country_of_citizenship;
        } else {
          citizenship = [a.country_of_citizenship];
        }

        return {
          applicant_id: a.applicant_id,
          name: `${a.first_name} ${a.last_name}`,
          email_address: a.email_address,
          phone_number: a.phone_number,
          registration_date: new Date(a.registration_date),
          country_of_citizenship: citizenship,
          country_of_residence: a.country_of_residence,
          bccnm_license_number: a?.bccnm_license_number,
          pr_status: a?.pr_status,
          nursing_educations: a.nursing_educations,
          health_authorities: health_authorities,
          notes: a.notes,
          assigned_to: assigned_to,
          additional_data: {
            first_name: a.first_name,
            last_name: a.last_name,
          },
        };
      },
    );
  }

  /**
   * We need to ignore all the recruiment related milestone for now
   */
  async allowedMilestones(): Promise<number[] | []> {
    const allowedIds: number[] = [];
    const milestones = await this.ienApplicantStatusRepository.find({
      select: ['id'],
      where: {
        parent: In([10001, 10002, 10004, 10005]),
      },
    });
    milestones.forEach(a => allowedIds.push(a.id));
    return allowedIds;
  }

  /**
   *
   * @param data raw applicant data
   * @param mappedApplicantList applicant_id and applicant.id map
   * @returns object that use in upsert milestone/status
   */
  async mapMilestones(data: any, mappedApplicantList: string[]) {
    const savedApplicants = await this.ienapplicantRepository.findByIds(mappedApplicantList);
    const applicantIdsMapping: any = {};
    const milestones: any = [];
    if (savedApplicants.length > 0) {
      savedApplicants.forEach(item => {
        applicantIdsMapping[`${item.applicant_id}`] = item.id;
      });
      const allowedMilestones = await this.allowedMilestones();
      data.forEach(
        (item: {
          applicant_id: string | number;
          hasOwnProperty: (arg0: string) => any;
          milestones: any;
        }) => {
          const tableId = applicantIdsMapping[item.applicant_id];
          if (item.hasOwnProperty('milestones')) {
            const existingMilestones = item.milestones;
            if (Array.isArray(existingMilestones)) {
              existingMilestones.forEach(m => {
                if (m.id in allowedMilestones) {
                  const temp: any = {
                    status: m.id,
                    start_date: m.start_date,
                    created_date: m.created_date,
                    updated_date: m.created_date,
                    applicant: tableId,
                    added_by: null,
                  };
                  if ('added_by' in m && m.added_by > 0) {
                    temp['added_by'] = m.added_by;
                  }
                  if ('reason_id' in m) {
                    temp['reason'] = m.reason_id;
                  }
                  if ('reason_other' in m) {
                    temp['reason_other'] = m.reason_other;
                  }
                  if ('effective_date' in m) {
                    temp['effective_date'] = m.effective_date;
                  }
                  milestones.push(temp);
                }
              });
            }
          }
        },
      );
    }
    return milestones;
  }
}
