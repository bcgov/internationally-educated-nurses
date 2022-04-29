/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppLogger } from 'src/common/logger.service';
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
    @Inject(Logger) private readonly logger: AppLogger,
    @InjectRepository(IENApplicantStatus)
    private readonly ienapplicantStatusRepository: Repository<IENApplicantStatus>,
    @InjectRepository(IENHaPcn)
    private readonly ienHaPcnRepository: Repository<IENHaPcn>,
    @InjectRepository(IENUsers)
    private readonly ienUsersRepository: Repository<IENUsers>,
    @InjectRepository(IENEducation)
    private readonly ienEducationListRepository: Repository<IENEducation>,
    @InjectRepository(IENJobTitle)
    private readonly ienJobTitleRepository: Repository<IENJobTitle>,
    @InjectRepository(IENJobLocation)
    private readonly ienJobLoactionRepository: Repository<IENJobLocation>,
    @InjectRepository(IENStatusReason)
    private readonly ienStatusReasonRepository: Repository<IENStatusReason>,
  ) {}

  async getStatus(): Promise<IENApplicantStatus[]> {
    return await this.ienapplicantStatusRepository.find({
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
    return this.ienJobLoactionRepository.find({
      order: {
        title: 'ASC',
      },
    });
  }

  async getStatusReasons(): Promise<IENStatusReason[]> {
    return this.ienStatusReasonRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }
}
