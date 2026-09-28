import { Logger } from '@nestjs/common';

/**
 * Cold-start diagnostic for BC's permanent UTC-7 rule (America/Vancouver, from 2026-11-01).
 * Log only — never throws.
 */
const ZONE = 'America/Vancouver';
const PROBE = new Date('2026-12-15T12:00:00Z');
const EXPECTED_OFFSET = 'GMT-7';

export enum RuntimeTzdataStatus {
  CONTAINS = 'CONTAINS_BC_PERMANENT_RULE',
  MISSING = 'MISSING_BC_PERMANENT_RULE',
}

export interface RuntimeTzdataInfo {
  node: string;
  tz: string;
  offset: string;
  ok: boolean;
  status: RuntimeTzdataStatus;
}

export const getRuntimeTzdataInfo = (): RuntimeTzdataInfo => {
  const offset =
    new Intl.DateTimeFormat('en-US', { timeZone: ZONE, timeZoneName: 'shortOffset' })
      .formatToParts(PROBE)
      .find(part => part.type === 'timeZoneName')?.value ?? 'unknown';
  const ok = offset === EXPECTED_OFFSET;

  return {
    node: process.version,
    tz: process.versions.tz ?? 'unknown',
    offset,
    ok,
    status: ok ? RuntimeTzdataStatus.CONTAINS : RuntimeTzdataStatus.MISSING,
  };
};

export const formatRuntimeTzdataInfo = (info: RuntimeTzdataInfo): string => {
  const description = info.ok
    ? 'Contains correct BC permanent UTC-7 rule'
    : 'Missing BC permanent UTC-7 rule';
  return (
    `node=${info.node} tz=${info.tz} ${ZONE}@2026-12-15=${info.offset} ` +
    `status=${info.status} — ${description}`
  );
};

// Uses Nest's static Logger, not AppLogger: AppLogger.error pushes to SQS and would raise a
// Teams alert on every cold start.
export const logRuntimeTzdata = (logger: Logger = new Logger('TZDATA')): void => {
  try {
    const info = getRuntimeTzdataInfo();
    const message = formatRuntimeTzdataInfo(info);
    if (info.ok) {
      logger.log(message);
    } else {
      logger.warn(message);
    }
  } catch (e) {
    logger.warn(`could not resolve ${ZONE} offset: ${(e as Error).message}`);
  }
};
