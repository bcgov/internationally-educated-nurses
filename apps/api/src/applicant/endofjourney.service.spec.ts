import { Connection, EntityManager } from 'typeorm';
import { AppLogger } from '../common/logger.service';
import { SystemMilestoneEvent } from '../common/system-milestone-event';
import { IENApplicantStatusAudit } from './entity/ienapplicant-status-audit.entity';
import { IENMasterService } from './ien-master.service';
import { EndOfJourneyService } from './endofjourney.service';

/**
 * Journey-complete cutoff date (`oneYearBeforeYesterday`) under BC's permanent UTC-7 rule
 * (America/Vancouver, from 2026-11-01).
 *
 * An applicant is marked "Journey Complete" when their job offer was accepted on or before
 * "yesterday, one year ago". "Yesterday" must be the BC calendar day. From Nov 2026 BC stays on
 * UTC-7 all year while the US Pacific zone (America/Los_Angeles) still drops to UTC-8 in winter,
 * so between 07:00 and 08:00 UTC (Nov–Mar) BC is already on the next day and the two zones give
 * cutoffs one day apart. Because the cutoff looks back a year, this only shows up from Nov 2027,
 * which is why these tests freeze "now" in late 2027.
 *
 * The nightly job (09:00 UTC) never lands in that hour; the re-engaged event can run at any time.
 *
 * Expected values are literal strings on purpose, so a wrong zone or constant is caught rather
 * than copied into the expectation.
 */

// True when this runtime's tzdata has BC's permanent UTC-7 rule (tzdata 2026b or later).
const hasPermanentBcRule = (): boolean =>
  new Intl.DateTimeFormat('en-US', { timeZone: 'America/Vancouver', timeZoneName: 'shortOffset' })
    .formatToParts(new Date('2026-12-15T12:00:00Z'))
    .find(part => part.type === 'timeZoneName')?.value === 'GMT-7';

// Tests that depend on the new rule only run where the runtime has it.
const itWithBcRule = hasPermanentBcRule() ? it : it.skip;

// A chainable stand-in for TypeORM's query builder that records every call.
const createQueryBuilderMock = (rows: unknown[] = []) => {
  const builder: Record<string, jest.Mock> = {};
  const chain = [
    'select',
    'addSelect',
    'leftJoin',
    'having',
    'where',
    'andWhere',
    'groupBy',
    'addGroupBy',
    'update',
    'set',
  ];
  chain.forEach(method => {
    builder[method] = jest.fn(() => builder);
  });
  builder.getRawMany = jest.fn().mockResolvedValue(rows);
  builder.getCount = jest.fn().mockResolvedValue(0);
  builder.execute = jest.fn().mockResolvedValue(undefined);
  return builder;
};

const createManagerMock = (builder: Record<string, jest.Mock>) =>
  ({ createQueryBuilder: jest.fn(() => builder) }) as unknown as EntityManager;

// The cutoff date passed into `.having('MAX(audit.effective_date) <= :oneYearBeforeYesterday')`.
const capturedCutoff = (builder: Record<string, jest.Mock>): string | undefined =>
  builder.having.mock.calls[0]?.[1]?.oneYearBeforeYesterday;

describe('EndOfJourneyService — journey-complete cutoff date in BC time', () => {
  let service: EndOfJourneyService;
  let logger: { log: jest.Mock; error: jest.Mock; warn: jest.Mock };

  const freezeNow = (iso: string) => {
    jest.useFakeTimers({ now: new Date(iso) });
  };

  const cutoffAt = async (iso: string): Promise<string | undefined> => {
    freezeNow(iso);
    const builder = createQueryBuilderMock();
    await service.getCompletedLists(createManagerMock(builder));
    return capturedCutoff(builder);
  };

  beforeEach(() => {
    logger = { log: jest.fn(), error: jest.fn(), warn: jest.fn() };
    const ienMasterService = {
      getStatusByStatus: jest.fn().mockResolvedValue({ id: 'not-proceeding-status-id' }),
    };
    service = new EndOfJourneyService(
      logger as unknown as AppLogger,
      ienMasterService as unknown as IENMasterService,
      {} as Connection,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('uses the BC date one year before yesterday (2026-03-10T12:00Z → 2025-03-09)', async () => {
    expect(await cutoffAt('2026-03-10T12:00:00Z')).toBe('2025-03-09');
  });

  itWithBcRule(
    'uses the BC date when BC and US Pacific are on different days (2027-12-15T07:30Z → 2026-12-14)',
    async () => {
      // BC (UTC-7) is 00:30 on 2027-12-15; the US Pacific zone (UTC-8) is still 23:30 on 12-14.
      expect(await cutoffAt('2027-12-15T07:30:00Z')).toBe('2026-12-14');
    },
  );

  it('gives the same cutoff at the nightly job time (2027-12-15T09:00Z → 2026-12-14)', async () => {
    expect(await cutoffAt('2027-12-15T09:00:00Z')).toBe('2026-12-14');
  });

  itWithBcRule(
    'applies the BC cutoff to the one applicant in a re-engaged event (2027-12-15T07:30Z → 2026-12-14)',
    async () => {
      freezeNow('2027-12-15T07:30:00Z');
      const builder = createQueryBuilderMock();
      const payload = { applicant: { id: 'applicant-1' } } as unknown as IENApplicantStatusAudit;

      await service.handleReEngagedEvent(
        payload,
        SystemMilestoneEvent.REENGAGED,
        createManagerMock(builder),
      );

      expect(builder.andWhere).toHaveBeenCalledWith('audit.applicant_id = :id', {
        id: 'applicant-1',
      });
      expect(capturedCutoff(builder)).toBe('2026-12-14');
    },
  );

  it('logs an error and runs no query when the re-engaged event has no entity manager', async () => {
    const payload = { applicant: { id: 'applicant-1' } } as unknown as IENApplicantStatusAudit;
    const getCompletedLists = jest.spyOn(service, 'getCompletedLists');

    await service.handleReEngagedEvent(
      payload,
      SystemMilestoneEvent.REENGAGED,
      undefined as unknown as EntityManager,
    );

    expect(logger.error).toHaveBeenCalledWith('Connection failed', 'END-OF-JOURNEY');
    expect(getCompletedLists).not.toHaveBeenCalled();
  });

  it('does not shift the cutoff on the day the BC rule takes effect (2026-11-01T07:00Z → 2025-10-31)', async () => {
    // The cutoff looks back a year, to Oct 2025 (before the rule change), so both zones agree.
    expect(await cutoffAt('2026-11-01T07:00:00Z')).toBe('2025-10-31');
  });

  it('does not shift the cutoff at the nightly job time on that day (2026-11-01T09:00Z → 2025-10-31)', async () => {
    expect(await cutoffAt('2026-11-01T09:00:00Z')).toBe('2025-10-31');
  });
});
