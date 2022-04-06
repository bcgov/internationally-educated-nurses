/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ExternalRequest } from 'src/common/external-request';
import { InjectRepository } from '@nestjs/typeorm';
import { IENHaPcn } from './entity/ienhapcn.entity';
import { Repository } from 'typeorm';
import { IENUsers } from './entity/ienusers.entity';
import { IENStatusReason } from './entity/ienstatus-reason.entity';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicant } from './entity/ienapplicant.entity';

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
  ) {}

  /**
   * Save all data for master tables.
   */
  async saveData() {
    const ha = this.saveHa();
    const users = this.saveUsers();
    const reasons = this.saveReasons();

    await Promise.all([ha, users, reasons]).then(res => {
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
      if (data instanceof Array) {
        const listHa = data.map((item: { title: any; name: any }) => {
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
      if (data instanceof Array) {
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
      if (data instanceof Array) {
        await this.ienStatusReasonRepository.upsert(data, ['id']);
      }
    } catch (e) {
      this.logger.log(`Error in saveReasons(): ${e}`);
    }
  }

  /**
   * fetch and upsert applicant details
   */
  async saveApplicant(): Promise<void> {
    try {
      const data = await this.external_request.getApplicants();
      await this.createBulkApplicants(data);
    } catch (e) {
      this.logger.error({ e });
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
    const { users, ha } = await this.getApplicantMasterData();
    const applicants = data.map(
      (a: {
        health_authorities: { title: any; id: number | string }[] | undefined;
        assigned_to: { id: string | number; name: any }[] | undefined;
        registration_date: string;
        applicant_id: any;
        first_name: any;
        last_name: any;
        email_address: any;
        phone_number: any;
        country_of_citizenship: any;
        country_of_residence: any;
        nursing_educations: any;
        notes: any;
      }) => {
        let health_authorities = null;
        if (a.health_authorities && a.health_authorities != undefined) {
          health_authorities = a.health_authorities.map(
            (h: { title: any; id: number | string }) => {
              h.title = ha[`${h.id}`].title;
              return h;
            },
          );
        }

        let assigned_to = null;
        if (a.assigned_to && a.assigned_to != undefined) {
          assigned_to = a.assigned_to.map((user: { id: string | number; name: any }) => {
            user.name = users[user.id].name;
            return user;
          });
        }

        return {
          applicant_id: a.applicant_id,
          name: `${a.first_name} ${a.last_name}`,
          email_address: a.email_address,
          phone_number: a.phone_number,
          registration_date: new Date(a.registration_date),
          country_of_citizenship: a.country_of_citizenship,
          country_of_residence: a.country_of_residence,
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
    const processed_applicant = await this.ienapplicantRepository.upsert(applicants, [
      'applicant_id',
    ]);
    this.logger.log({ processed_applicant });
  }
}
