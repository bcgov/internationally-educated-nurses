/**
 * BC time. From 2026-11-01 BC stays on UTC-7 all year ("Pacific time", PCT).
 * Use this zone for every BC calendar date or clock time; never America/Los_Angeles.
 */
export const BC_TIMEZONE = 'America/Vancouver';

/** Official abbreviation for BC's year-round zone; replaces the seasonal PST/PDT. */
export const BC_TIMEZONE_LABEL = 'PCT';

/** Date-only values, e.g. `2026-12-15`. */
export const DATE_FORMAT = 'YYYY-MM-DD';

/** Timestamps in log messages, e.g. `2026-12-15 02:00:00 -07:00`. */
export const LOG_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss Z';
