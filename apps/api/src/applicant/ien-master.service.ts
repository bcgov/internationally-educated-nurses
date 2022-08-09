/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IENApplicantStatus } from './entity/ienapplicant-status.entity';
import { IENHaPcn } from './entity/ienhapcn.entity';
import { IENUsers } from './entity/ienusers.entity';
import { IENEducation } from './entity/ieneducation.entity';
import { IENJobTitle } from './entity/ienjobtitles.entity';
import { IENJobLocation } from './entity/ienjoblocation.entity';
import { IENStatusReason } from './entity/ienstatus-reason.entity';

@Injectable()
export class IENMasterService {
  applicantRelations: any;
  constructor(
    @InjectRepository(IENApplicantStatus)
    readonly ienApplicantStatusRepository: Repository<IENApplicantStatus>,
    @InjectRepository(IENHaPcn)
    readonly ienHaPcnRepository: Repository<IENHaPcn>,
    @InjectRepository(IENUsers)
    readonly ienUsersRepository: Repository<IENUsers>,
    @InjectRepository(IENEducation)
    readonly ienEducationListRepository: Repository<IENEducation>,
    @InjectRepository(IENJobTitle)
    readonly ienJobTitleRepository: Repository<IENJobTitle>,
    @InjectRepository(IENJobLocation)
    readonly ienJobLocationRepository: Repository<IENJobLocation>,
    @InjectRepository(IENStatusReason)
    readonly ienStatusReasonRepository: Repository<IENStatusReason>,
  ) {}

  async getStatus(): Promise<IENApplicantStatus[]> {
    return this.ienApplicantStatusRepository.find({
      where: {
        parent: IsNull(),
      },
      relations: ['children'],
    });
  }

  async getHaPcn(): Promise<IENHaPcn[]> {
    return this.ienHaPcnRepository.find({
      order: {
        title: 'ASC',
      },
    });
  }

  async getUsers(): Promise<IENUsers[]> {
    return this.ienUsersRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async getEducation(): Promise<IENEducation[]> {
    return this.ienEducationListRepository.find({
      order: {
        title: 'ASC',
      },
    });
  }

  async getJobTitles(): Promise<IENJobTitle[]> {
    return this.ienJobTitleRepository.find({
      order: {
        title: 'ASC',
      },
    });
  }

  async getJobLocations(): Promise<IENJobLocation[]> {
    return this.ienJobLocationRepository.find({
      order: {
        ha_pcn: 'ASC',
        title: 'ASC',
      },
    });
  }

  async getStatusReasons(): Promise<IENStatusReason[]> {
    /** MVP scope: We are only handling recruitment-related withdrawal reasons. */
    return this.ienStatusReasonRepository.find({
      where: {
        recruitment: true,
      },
      order: {
        name: 'ASC',
      },
    });
  }
}
