import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';

import { Connection, EntityManager, SelectQueryBuilder, createConnection } from 'typeorm';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { AtsApplicant, END_OF_JOURNEY_FLAG, IENApplicantStatusRO, STATUS } from '@ien/common';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicantStatusAudit } from './entity/ienapplicant-status-audit.entity';
import { IENMasterService } from './ien-master.service';
import { OnEvent } from '@nestjs/event-emitter';
import { SystemMilestoneEvent } from 'src/common/system-milestone-event';
import { IENApplicant } from './entity/ienapplicant.entity';

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

  async handleEndOfJourney<T, U = any>(
    getter: Getter<T, U>,
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
  getCompletedLists: Getter<
    IEN_APPLICANT_END_OF_JOURNEY,
    (
      query: SelectQueryBuilder<IENApplicantStatusAudit>,
    ) => SelectQueryBuilder<IENApplicantStatusAudit>
  > = async (manager, meta = query => query) => {
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
    let query = manager
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
    query = meta(query);
    query = this.checkReEngagedStatusForEoJCompleteQuery(query);
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
  checkReEngagedStatusForEoJCompleteQuery(
    query: SelectQueryBuilder<IENApplicantStatusAudit>,
  ): SelectQueryBuilder<IENApplicantStatusAudit> {
    return query.andWhere(
      `NOT EXISTS (
          SELECT 1
          FROM ien_applicant_status_audit reengaged_audit
          JOIN ien_applicant_status reengaged_status ON reengaged_audit.status_id = reengaged_status.id
          WHERE reengaged_audit.applicant_id = audit.applicant_id
          AND reengaged_status.status = :reEngagedStatus
          AND reengaged_audit.start_date = (
              SELECT MAX(inner_audit.start_date)
              FROM ien_applicant_status_audit inner_audit
              JOIN ien_applicant_status inner_status ON inner_audit.status_id = inner_status.id
              WHERE inner_audit.applicant_id = audit.applicant_id
              AND inner_status.status = :reEngagedStatus
          )
          AND reengaged_audit.start_date <= (audit.effective_date + INTERVAL '1 year')
      )`,
      { reEngagedStatus: STATUS.RE_ENGAGED },
    );
  }

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
      let query = this.getIncompleteQuery(manager, applicant.applicant_id);
      query = this.checkReEngagedStatusForEoJIncompleteQuery(query);

      const result = await query
        .update('ien_applicants')
        .set({
          end_of_journey: END_OF_JOURNEY_FLAG.JOURNEY_INCOMPLETE,
          updated_date: dayjs().tz('America/Los_Angeles').toDate(),
        })
        .execute();
      results.push(result);
    }
    this.logger.log({ results }, 'END-OF-JOURNEY');
  };
  getIncompleteQuery(
    manager: EntityManager,
    applicant_id: string,
  ): SelectQueryBuilder<IENApplicant> {
    return manager
      .createQueryBuilder()
      .from(IENApplicant, 'ien_applicants')
      .where('id = :id', { id: applicant_id })
      .andWhere('(end_of_journey != :end_of_journey OR end_of_journey IS NULL)', {
        end_of_journey: END_OF_JOURNEY_FLAG.JOURNEY_INCOMPLETE,
      });
  }
  checkReEngagedStatusForEoJIncompleteQuery(
    query: SelectQueryBuilder<IENApplicant>,
  ): SelectQueryBuilder<IENApplicant> {
    return query.andWhere(
      `NOT EXISTS (
          SELECT 1
          FROM ien_applicant_status_audit reengaged_audit
          JOIN ien_applicant_status reengaged_status 
            ON reengaged_audit.status_id = reengaged_status.id
          WHERE reengaged_audit.applicant_id = ien_applicants.id
            AND reengaged_status.status = :reEngagedStatus
            AND (
              SELECT MAX(inner_audit.start_date)
              FROM ien_applicant_status_audit inner_audit
              JOIN ien_applicant_status inner_status 
                ON inner_audit.status_id = inner_status.id
              WHERE inner_audit.applicant_id = ien_applicants.id
                AND inner_status.status = :reEngagedStatus
            ) > (
              SELECT MAX(not_proceeding_audit.start_date)
              FROM ien_applicant_status_audit not_proceeding_audit
              JOIN ien_applicant_status not_proceeding_status 
                ON not_proceeding_audit.status_id = not_proceeding_status.id
              WHERE not_proceeding_audit.applicant_id = ien_applicants.id
                AND not_proceeding_status.status = :notProceedingStatus
            )
        )`,
      { reEngagedStatus: STATUS.RE_ENGAGED, notProceedingStatus: STATUS.NOT_PROCEEDING },
    );
  }

  /**
   * Event handler for delete re-engaged applicants
   */
  @OnEvent(`${SystemMilestoneEvent.REENGAGED}.*`)
  async handleReEngagedDeleteEvent(
    payload: IENApplicantStatusAudit,
    event: SystemMilestoneEvent,
  ): Promise<void> {
    this.logger.log(`Handling re-engaged event: ${event}`, 'END-OF-JOURNEY');

    const connection = this.connection;
    if (!connection) {
      this.logger.error('Connection failed', 'END-OF-JOURNEY');
      return;
    }
    const queryRunner = connection.createQueryRunner();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;

    await this.handleReEngagedForJourneyComplete(manager, payload);
    await this.handleReEngagedForJourneyIncomplete(manager, payload);

    await queryRunner.commitTransaction();
  }

  private async handleReEngagedForJourneyComplete(
    manager: EntityManager,
    payload: IENApplicantStatusAudit,
  ): Promise<void> {
    // Implement the logic for handling re-engaged applicants for journey complete
    this.logger.log(
      `Handling re-engaged for journey complete for applicant ${payload.applicant.id}`,
      'END-OF-JOURNEY',
    );
    const completedList = await this.getCompletedLists(manager, query =>
      query.andWhere('audit.applicant_id = :id', { id: payload.applicant.id }),
    );

    if (completedList.length === 0) {
      this.cleanEndOfJourneyFlag(manager, payload);
    } else {
      this.setCompletedLists(manager, completedList);
    }
  }

  private async handleReEngagedForJourneyIncomplete(
    manager: EntityManager,
    payload: IENApplicantStatusAudit,
  ): Promise<void> {
    // Implement the logic for handling re-engaged applicants for journey complete
    this.logger.log(
      `Handling re-engaged for journey incomplete for applicant ${payload.applicant.id}`,
      'END-OF-JOURNEY',
    );

    const query = manager
      .createQueryBuilder(IENApplicant, 'applicant')
      .select([
        'applicant.id AS applicant_id', // Select applicant_id
        'status.id AS milestone_id', // Include milestone id
        'status.status AS milestone', // Include milestone (status)
        'audit.start_date AS milestone_start_date', // Include milestone start date
      ])
      .leftJoin('ien_applicant_status_audit', 'audit', 'audit.applicant_id = applicant.id')
      .leftJoin('ien_applicant_status', 'status', 'status.id = audit.status_id')
      .where('applicant.id = :id', { id: payload.applicant.id });

    const rawResults = await query.getRawMany();
    const applicants = rawResults.reduce((result, row) => {
      let applicant = result.find((a: any) => a.applicant_id === row.applicant_id);

      if (!applicant) {
        applicant = { applicant_id: row.applicant_id, milestones: [] };
        result.push(applicant);
      }

      if (row.milestone) {
        applicant.milestones.push({
          id: row.milestone_id,
          name: row.milestone,
          start_date: row.milestone_start_date,
        });
      }

      return result;
    }, []);

    const notProceedingList = await this.getNotProceedingLists(
      manager,
      applicants as AtsApplicant[],
    );

    if (notProceedingList.length > 0) {
      let query = this.getIncompleteQuery(manager, payload.applicant.id);
      query = this.checkReEngagedStatusForEoJIncompleteQuery(query);      
      if ((await query.getCount()) === 0) {
        this.cleanEndOfJourneyFlag(manager, payload);
      } else {
        this.setNotProceedingLists(manager, notProceedingList);
      }
    }
  }

  private async cleanEndOfJourneyFlag(manager: EntityManager, payload: IENApplicantStatusAudit) {
    await manager
      .createQueryBuilder()
      .update('ien_applicants')
      .set({
        end_of_journey: null,
        updated_date: dayjs().tz('America/Los_Angeles').toDate(),
      })
      .where('id = :id', { id: payload.applicant.id })
      .andWhere('end_of_journey IS NOT NULL')
      .execute();
  }
}
