import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';

import { Connection, EntityManager, createConnection } from 'typeorm';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { AtsApplicant, END_OF_JOURNEY_FLAG, STATUS } from '@ien/common';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicantStatusAudit } from './entity/ienapplicant-status-audit.entity';
import { IENMasterService } from './ien-master.service';

dayjs.extend(utc);
dayjs.extend(timezone);
const formatDateInPST = (date: Date) => {
  return dayjs(date)
    .tz('America/Los_Angeles') // Convert to PST
    .format('YYYY-MM-DD'); // Format as YYYY-MM-DD
};

type Getter<T = unknown, U = unknown> = (manager: EntityManager, meta?: U) => Promise<T[]>;
type Setter<T = unknown> = (manager: EntityManager, list: T[]) => Promise<void>;
type IEN_APPLICANT_END_OF_JOURNEY = {
  applicant_id: string;
  effective_date: string;
  status: string;
  ha_pcn_id: string;
};

@Injectable()
export class EndOfJourneyService implements OnModuleInit {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @Inject(IENMasterService)
    private readonly ienMasterService: IENMasterService,
    private connection: Connection,
  ) {}
  async onModuleInit() {
    // Create the connection when the module initializes
    if (!this.connection?.isConnected) {
      this.connection = await createConnection();
      this.logger.log('EOJ Database connection established', 'END-OF-JOURNEY');
    }
  }

  /**
   * Entry point
   */
  async init(): Promise<void> {
    this.logger.log(
      `End of journey checking started at ${dayjs().tz('America/Los_Angeles')}`,
      'END-OF-JOURNEY',
    );

    const connection = this.connection;
    if (!connection) {
      this.logger.error('Connection failed', 'END-OF-JOURNEY');
      return;
    }
    const queryRunner = connection.createQueryRunner('master');
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;

    try {
      // handle end of journey: COMPLETED
      await this.handleEndOfJourney<IEN_APPLICANT_END_OF_JOURNEY>(
        this.getCompletedLists,
        this.setCompletedLists,
        manager,
      );

      await manager.queryRunner?.commitTransaction();
      this.logger.log(
        `End of journey checking end at ${dayjs().tz('America/Los_Angeles')}`,
        'END-OF-JOURNEY',
      );
    } catch (e) {
      await manager.queryRunner?.rollbackTransaction();
      if (e instanceof Error) {
        throw new InternalServerErrorException(`Transaction failed: ${e.message}`);
      } else {
        throw new InternalServerErrorException('Transaction failed with an unknown error');
      }
    } finally {
      this.logger.log(`finally`, 'END-OF-JOURNEY');
      await manager.queryRunner?.release();
    }
  }

  async handleEndOfJourney<T>(
    getter: Getter<T>,
    setter: Setter<T>,
    manager: EntityManager,
  ): Promise<void> {
    const list = await getter(manager);
    if (list.length === 0) {
      this.logger.log(
        `End of journey - Journey Complete checking at ${dayjs().tz(
          'America/Los_Angeles',
        )} with no data`,
        'END-OF-JOURNEY',
      );
      return;
    }
    await setter(manager, list);
  }

  /**
   * Checking for end of journey COMPLETED
   * QUITERIA:
   */
  getCompletedLists: Getter<IEN_APPLICANT_END_OF_JOURNEY> = async manager => {
    const yesterday = dayjs().tz('America/Los_Angeles').subtract(1, 'day').toDate();
    const oneYearBeforeYesterday = formatDateInPST(
      dayjs(yesterday).tz('America/Los_Angeles').subtract(1, 'year').toDate(),
    );

    /**
     * Query to fetch the latest status change information for applicants with a "Job Offer Accepted" status.
     *
     * @return
     *  - applicant_id: string, the unique identifier for each applicant.
     *  - effective_date: Date, the latest (most recent) effective_date related to the applicant's status.
     *  - status: string, the status of the applicant (in this case, "Job Offer Accepted").
     */
    const query = manager
      .createQueryBuilder(IENApplicantStatusAudit, 'audit')
      .select('audit.applicant_id') // Select applicant_id
      .addSelect("TO_CHAR(MAX(audit.effective_date), 'YYYY-MM-DD')", 'effective_date') // Format effective_date as YYYY-MM-DD
      .addSelect('status.status', 'status') // Get the status
      .addSelect('job.ha_pcn_id', 'ha_pcn_id')
      .leftJoin('audit.status', 'status')
      .leftJoin('audit.job', 'job')
      .leftJoin(
        'ien_applicants_active_flag',
        'active_flag',
        'audit.applicant_id = active_flag.applicant_id',
      )
      .having('MAX(audit.effective_date) <= :oneYearBeforeYesterday', { oneYearBeforeYesterday }) // Use HAVING for aggregate filtering
      .where('status.status = :status', { status: STATUS.JOB_OFFER_ACCEPTED }) // Filter by status
      .andWhere('audit.effective_date IS NOT NULL') // Filter out null effective_date
      .groupBy('audit.applicant_id') // Group by applicant_id
      .addGroupBy('status.id')
      .addGroupBy('job.id');

    const applicants = await query.getRawMany();

    this.logger.log({ yesterday, oneYearBeforeYesterday, applicants }, 'END-OF-JOURNEY');
    return applicants;
  };
  setCompletedLists: Setter<IEN_APPLICANT_END_OF_JOURNEY> = async (manager, list) => {
    this.logger.log(`Setting end of journey - Journey Complete`, 'END-OF-JOURNEY');
    for (const applicant of list) {
      // update the end_of_journey flag and updated_date of the applicant
      await manager
        .createQueryBuilder()
        .update('ien_applicants')
        .set({
          end_of_journey: END_OF_JOURNEY_FLAG.JOURNEY_COMPLETE,
          updated_date: dayjs().tz('America/Los_Angeles').toDate(),
        })
        .where('id = :id', { id: applicant.applicant_id })
        .execute();
    }
  };

  async handleNotProceedingMilestone(
    applicants: AtsApplicant[],
    manager: EntityManager,
  ): Promise<void> {
    this.logger.log(`Checking for end of journey: ${STATUS.NOT_PROCEEDING}`, 'END-OF-JOURNEY');
    const hasNotProceedingApplicants = await this.getNotProceedingLists(manager, applicants);
    if (hasNotProceedingApplicants.length === 0) {
      this.logger.log(
        `End of journey checking status: ${STATUS.NOT_PROCEEDING} at ${dayjs().tz(
          'America/Los_Angeles',
        )} with no data`,
        'END-OF-JOURNEY',
      );
      return;
    }
    await this.setNotProceedingLists(manager, hasNotProceedingApplicants);
  }
  getNotProceedingLists: Getter<AtsApplicant, AtsApplicant[]> = async (manager, meta = []) => {
    if (manager) {
      const notProceedingStatus = await this.ienMasterService.getStatusByStatus(
        STATUS.NOT_PROCEEDING,
      );

      // filter out the applicants whose status is "Not Proceeding"
      const applicants = meta;
      const hasNotProceedingApplicants = applicants.filter(({ milestones }) =>
        milestones?.some(({ id }) => id === notProceedingStatus.id),
      );
      this.logger.log(
        `Number of not proceeding applicants: ${hasNotProceedingApplicants.length}`,
        'END-OF-JOURNEY',
      );
      return hasNotProceedingApplicants;
    }
    return [];
  };
  setNotProceedingLists: Setter<AtsApplicant> = async (manager, list) => {
    this.logger.log(
      `Setting end of journey incomplete: ${STATUS.NOT_PROCEEDING}. Number of lists: ${list.length}`,
      'END-OF-JOURNEY',
    );
    const results = [];
    for (const applicant of list) {
      // update the end_of_journey_flag and updated_date of the applicant
      const result = await manager
        .createQueryBuilder()
        .update('ien_applicants')
        .set({
          end_of_journey: END_OF_JOURNEY_FLAG.JOURNEY_INCOMPLETE,
          updated_date: dayjs().tz('America/Los_Angeles').toDate(),
        })
        .where('id = :id', { id: applicant.applicant_id })
        .andWhere('(end_of_journey != :end_of_journey OR end_of_journey IS NULL)', {
          end_of_journey: END_OF_JOURNEY_FLAG.JOURNEY_INCOMPLETE,
        })
        .execute();
      results.push(result);
    }
    this.logger.log({ results }, 'END-OF-JOURNEY');
  };
}
