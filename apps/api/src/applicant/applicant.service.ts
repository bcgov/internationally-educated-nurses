import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ApplicantFilterDto } from '@ien/common';
import { ApplicantEntity } from './entity/applicant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppLogger } from 'src/common/logger.service';

@Injectable()
export class ApplicantService {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @InjectRepository(ApplicantEntity)
    private readonly applicantRepository: Repository<ApplicantEntity>,
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
        updatedDate: 'DESC',
      },
      relations: ['status', 'status.parent'],
    });
  }

  async getApplicantById(id: string): Promise<ApplicantEntity> {
    let applicant;
    try {
      applicant = await this.applicantRepository.findOne(id);
    } catch (e) {
      this.logger.error(e);
      throw new NotFoundException(`Applicant with id '${id}' not found`);
    }
    if (!applicant) {
      throw new NotFoundException(`Applicant with id '${id}' not found`);
    }
    return applicant;
  }
}
