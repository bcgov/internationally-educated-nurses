import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { getConnection, EntityManager, Brackets } from 'typeorm';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { STATUS } from '@ien/common';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicantStatusAudit } from './entity/ienapplicant-status-audit.entity';
import { IENApplicantStatus } from './entity/ienapplicant-status.entity';
import { IENMasterService } from './ien-master.service';

dayjs.extend(utc);
dayjs.extend(timezone);
const formatDateInPST = (date: Date) => {
  return dayjs(date)
    .tz('America/Los_Angeles') // Convert to PST
    .format('YYYY-MM-DD'); // Format as YYYY-MM-DD
};

type Getter<T = unknown> = (manager: EntityManager) => Promise<T[]>;
type Setter<T = unknown> = (manager: EntityManager, list: T[]) => Promise<void>;
type IEN_APPLICANT_END_OF_JOURNEY = {
  applicant_id: string;
  effective_date: string;
  status: string;
  ha_pcn_id: string;
};

@Injectable()
export class EndOfJourneyService {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @Inject(IENMasterService)
    private readonly ienMasterService: IENMasterService,
  ) {}

  /**
   * Entry point
   */
  async init(): Promise<void> {
    this.logger.log(
      `End of journey checking started at ${dayjs().tz('America/Los_Angeles')}`,
      'END-OF-JOURNEY',
    );

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;

    try {
      // handle end of journey: COMPLETED
      await this.handleEndOfJourney<IEN_APPLICANT_END_OF_JOURNEY>(
        this.getCompletedLists,
        this.setCompletedLists,
        manager,
        STATUS.END_OF_JOURNEY_COMPLETE,
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
      await manager.queryRunner?.release();
    }
  }

  async handleEndOfJourney<T>(
    getter: Getter<T>,
    setter: Setter<T>,
    manager: EntityManager,
    status: STATUS,
  ): Promise<void> {
    const list = await getter(manager);
    if (list.length === 0) {
      this.logger.log(
        `End of journey checking status: ${status} at ${dayjs().tz(
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
      .having('MAX(audit.effective_date) = :oneYearBeforeYesterday', { oneYearBeforeYesterday }) // Use HAVING for aggregate filtering
      .where('status.status = :status', { status: STATUS.JOB_OFFER_ACCEPTED }) // Filter by status
      .andWhere('audit.effective_date IS NOT NULL') // Filter out null effective_date
      .andWhere(
        new Brackets(qb => {
          qb.where('active_flag.applicant_id IS NULL').orWhere('active_flag.status_id IS NULL');
        }),
      ) // Exclude applicants in ien_applicants_active_flag or with a status_id
      .groupBy('audit.applicant_id') // Group by applicant_id
      .addGroupBy('status.id')
      .addGroupBy('job.id');

    const applicants = await query.getRawMany();

    this.logger.log({ yesterday, oneYearBeforeYesterday, applicants }, 'END-OF-JOURNEY');
    return applicants;
  };
  setCompletedLists: Setter<IEN_APPLICANT_END_OF_JOURNEY> = async (manager, list) => {
    // write into the audit table with new milestone: END_OF_JOURNEY_COMPLETED
    // start_date, notes, status

    const today = dayjs().tz('America/Los_Angeles').format('YYYY-MM-DD');
    // Attempt to get the status ID, and handle the error if the status is not found
    let endOfJourneyCompleteStatus;
    try {
      endOfJourneyCompleteStatus = await manager.findOneOrFail(IENApplicantStatus, {
        where: { status: STATUS.END_OF_JOURNEY_COMPLETE },
      });
    } catch (error) {
      this.logger.error(`Status not found: ${STATUS.END_OF_JOURNEY_COMPLETE}`, 'END-OF-JOURNEY');
      throw new Error(`Status not found: ${STATUS.END_OF_JOURNEY_COMPLETE}`);
    }

    const haPcns = await this.ienMasterService.getHaPcn();

    for (const applicant of list) {
      await manager
        .createQueryBuilder()
        .insert()
        .into(IENApplicantStatusAudit)
        .values({
          applicant: { id: applicant.applicant_id }, // Setting the applicant_id from the list
          start_date: today, // Start date is today in YYYY-MM-DD format
          status: endOfJourneyCompleteStatus, // Status is set to END_OF_JOURNEY_COMPLETED
          notes: `Updated by Lambda CRON at ${dayjs()
            .tz('America/Los_Angeles')
            .format('YYYY-MM-DD HH:mm:ss')} and status: END_OF_JOURNEY_COMPLETE`, // Note with current time
        })
        .execute();
    }

    // write every HaPcn into ien_applicants_active_flag table with is_active = false
    for (const applicant of list) {
      for (const haPcn of haPcns) {
        // First, attempt the update table "ien_applicants_active_flag"
        const result = await manager
          .createQueryBuilder()
          .update('ien_applicants_active_flag')
          .set({
            is_active: false,
            status_id: endOfJourneyCompleteStatus.id,
          })
          .where('ha_id = :ha_pcn_id', { ha_pcn_id: haPcn.id })
          .andWhere('applicant_id = :applicant_id', { applicant_id: applicant.applicant_id })
          .execute();

        // If no rows were updated, perform an insert
        if (result.affected === 0) {
          await manager
            .createQueryBuilder()
            .insert()
            .into('ien_applicants_active_flag')
            .values({
              ha_id: haPcn.id,
              applicant_id: applicant.applicant_id,
              is_active: false,
              status_id: endOfJourneyCompleteStatus.id,
            })
            .execute();
        }
      }

      // update the status and updated_date of the applicant
      await manager
        .createQueryBuilder()
        .update('ien_applicants')
        .set({
          status: endOfJourneyCompleteStatus,
          updated_date: dayjs().tz('America/Los_Angeles').toDate(),
        })
        .where('id = :id', { id: applicant.applicant_id })
        .execute();
    }
  };
}
