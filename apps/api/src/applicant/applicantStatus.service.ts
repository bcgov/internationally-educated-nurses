import { Inject, Injectable, Logger } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { ApplicantStatusEntity } from './entity/applicantStatus.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppLogger } from 'src/common/logger.service';

@Injectable()
export class ApplicantStatusService {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @InjectRepository(ApplicantStatusEntity)
    private readonly applicantStatusRepository: Repository<ApplicantStatusEntity>,
  ) {}

  async getApplicantStatus(): Promise<ApplicantStatusEntity[]> {
    return await this.applicantStatusRepository.find({
      where: {
        parent: IsNull(),
      },
      relations: ['children'],
    });
  }
}
