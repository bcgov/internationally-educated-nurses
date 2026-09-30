import { Logger } from '@nestjs/common';
import {
  RuntimeTzdataStatus,
  formatRuntimeTzdataInfo,
  getRuntimeTzdataInfo,
  logRuntimeTzdata,
} from './runtime-tzdata';

// Replaces Intl.DateTimeFormat so the helper sees the given offset for America/Vancouver.
const mockOffset = (offset: string) =>
  jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(
    () =>
      ({
        formatToParts: () => [{ type: 'timeZoneName', value: offset }],
      }) as unknown as Intl.DateTimeFormat,
  );

const mockLogger = () => {
  const logger = new Logger('TZDATA');
  const log = jest.spyOn(logger, 'log').mockImplementation(() => undefined);
  const warn = jest.spyOn(logger, 'warn').mockImplementation(() => undefined);
  return { logger, log, warn };
};

describe('runtime-tzdata', () => {
  afterEach(() => jest.restoreAllMocks());

  describe('getRuntimeTzdataInfo', () => {
    it('reports CONTAINS when America/Vancouver resolves to GMT-7 in Dec 2026', () => {
      mockOffset('GMT-7');

      const info = getRuntimeTzdataInfo();

      expect(info.ok).toBe(true);
      expect(info.offset).toBe('GMT-7');
      expect(info.status).toBe(RuntimeTzdataStatus.CONTAINS);
      expect(info.node).toBe(process.version);
    });

    it('reports MISSING when America/Vancouver resolves to GMT-8 in Dec 2026', () => {
      mockOffset('GMT-8');

      const info = getRuntimeTzdataInfo();

      expect(info.ok).toBe(false);
      expect(info.status).toBe(RuntimeTzdataStatus.MISSING);
    });

    it('asks Intl for the America/Vancouver zone', () => {
      const spy = mockOffset('GMT-7');

      getRuntimeTzdataInfo();

      expect(spy).toHaveBeenCalledWith(
        'en-US',
        expect.objectContaining({ timeZone: 'America/Vancouver', timeZoneName: 'shortOffset' }),
      );
    });
  });

  describe('formatRuntimeTzdataInfo', () => {
    it('formats the CONTAINS line', () => {
      const line = formatRuntimeTzdataInfo({
        node: 'v24.21.0',
        tz: '2026c',
        offset: 'GMT-7',
        ok: true,
        status: RuntimeTzdataStatus.CONTAINS,
      });

      expect(line).toBe(
        'node=v24.21.0 tz=2026c America/Vancouver@2026-12-15=GMT-7 ' +
          'status=CONTAINS_BC_PERMANENT_RULE — Contains correct BC permanent UTC-7 rule',
      );
    });

    it('formats the MISSING line', () => {
      const line = formatRuntimeTzdataInfo({
        node: 'v22.22.2',
        tz: '2025c',
        offset: 'GMT-8',
        ok: false,
        status: RuntimeTzdataStatus.MISSING,
      });

      expect(line).toBe(
        'node=v22.22.2 tz=2025c America/Vancouver@2026-12-15=GMT-8 ' +
          'status=MISSING_BC_PERMANENT_RULE — Missing BC permanent UTC-7 rule',
      );
    });
  });

  describe('logRuntimeTzdata', () => {
    it('logs at info level when the rule is present', () => {
      mockOffset('GMT-7');
      const { logger, log, warn } = mockLogger();

      logRuntimeTzdata(logger);

      expect(log).toHaveBeenCalledWith(expect.stringContaining('CONTAINS_BC_PERMANENT_RULE'));
      expect(warn).not.toHaveBeenCalled();
    });

    it('logs at warn level when the rule is missing', () => {
      mockOffset('GMT-8');
      const { logger, log, warn } = mockLogger();

      logRuntimeTzdata(logger);

      expect(warn).toHaveBeenCalledWith(expect.stringContaining('MISSING_BC_PERMANENT_RULE'));
      expect(log).not.toHaveBeenCalled();
    });

    it('never throws, even if Intl fails', () => {
      jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => {
        throw new RangeError('Invalid time zone specified');
      });
      const { logger, warn } = mockLogger();

      expect(() => logRuntimeTzdata(logger)).not.toThrow();
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Invalid time zone specified'));
    });
  });
});
