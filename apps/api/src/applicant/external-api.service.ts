/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ExternalRequest } from 'src/common/external-request';
import { InjectRepository } from '@nestjs/typeorm';
import { IENHaPcn } from './entity/ienhapcn.entity';
import { Repository } from 'typeorm';
import { IENUsers } from './entity/ienusers.entity';
import { IENStatusReason } from './entity/ienstatus-reason.entity';
import { AppLogger } from 'src/common/logger.service';

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
}
