/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from '@nestjs/common';
import { ExternalRequest } from 'src/common/external-request';
import { InjectRepository } from '@nestjs/typeorm';
import { IENHaPcn } from './entity/ienhapcn.entity';
import { Repository } from 'typeorm';
import { IENUsers } from './entity/ienusers.entity';
import { IENStatusReason } from './entity/ienstatus-reason.entity';

@Injectable()
export class ExternalAPIService {
  applicantRelations: any;
  constructor(
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await Promise.all([ha, users, reasons]).then(res => console.log('done'));
  }

  /**
   * All data has one unique column,
   * which is replicate and reflact multipletime in received array
   * So we have to replace latest details, SO taht upsert transaction works
   * @param data Data array
   */
  cleanData(data: string | any[]) {
    const keys: any = {};
    for (let i = 0; i < data.length; i++) {
      keys[data[i]['id']] = data[i];
    }
    return keys;
  }

  /**
   * Collect HealthAuthorities data from <domain>/HealthAuthority Url.
   * and Save in ien_ha_pcn table in database for applicant reference.
   */
  async saveHa(): Promise<void> {
    const data = await this.external_request.getHa();
    if (data instanceof Array) {
      const keys: any = this.cleanData(data);
      const listHa: any = [];
      for (const [key] of Object.entries(keys)) {
        const item = {
          id: keys[key].id,
          title: keys[key].name,
          abbreviation: keys[key].abbreviation,
        };
        listHa.push(this.ienHaPcnRepository.create(item));
      }
      await this.ienHaPcnRepository.save(listHa);
    }
  }

  /**
   * Collect Staff/User data from <domain>/staff Url.
   * and Save in ien_users table in database for applicant reference.
   */
  async saveUsers(): Promise<void> {
    const data = await this.external_request.getStaff();
    if (data instanceof Array) {
      const keys: any = this.cleanData(data);
      const listUsers: any = [];
      for (const [key] of Object.entries(keys)) {
        listUsers.push(this.ienUsersRepository.create(keys[key]));
      }
      await this.ienUsersRepository.save(listUsers);
    }
  }

  /**
   * Collect Milestone reason data from <domain>/Reason Url.
   * and Save in ien_status_reasons table in database for milestone/status reference.
   */
  async saveReasons(): Promise<void> {
    const data = await this.external_request.getReason();
    if (data instanceof Array) {
      const keys: any = this.cleanData(data);
      console.log({ keys });
      const listReasons: any = [];
      for (const [key] of Object.entries(keys)) {
        listReasons.push(this.ienStatusReasonRepository.create(keys[key]));
      }
      await this.ienStatusReasonRepository.save(listReasons);
    }
  }
}
