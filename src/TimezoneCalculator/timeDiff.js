/**
 * Timezone difference utilities.
 *
 * Offsets are derived with `Intl.DateTimeFormat`, which resolves the correct
 * UTC offset for an IANA zone *at a specific instant* — so DST transitions and
 * historical offset changes are handled automatically. No hard-coded offset
 * tables are used.
 */

/**
 * Compute the UTC offset (in whole minutes) for an IANA timezone at a given
 * instant. Positive means ahead of UTC (east), negative means behind (west).
 *
 * Technique: format the instant as the zone's wall-clock time, re-interpret
 * those wall-clock fields as if they were UTC, and measure the gap from the
 * real instant.
 *
 * @param {string} timeZone - IANA identifier, e.g. "America/New_York".
 * @param {Date}   [date]   - Instant to evaluate (defaults to now).
 * @returns {number} Offset from UTC in minutes.
 */
export function getOffsetMinutes(timeZone, date = new Date()) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23', // avoids the "24" midnight quirk of hour12:false
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const parts = dtf.formatToParts(date).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});

  const wallClockAsUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );

  return Math.round((wallClockAsUTC - date.getTime()) / 60000);
}

/**
 * Signed difference (in minutes) of `zoneTo` relative to `zoneFrom` at an
 * instant. Positive means `zoneTo` is ahead of `zoneFrom`.
 *
 * @param {string} zoneFrom - Reference/base IANA zone.
 * @param {string} zoneTo   - Comparison IANA zone.
 * @param {Date}   [date]   - Instant to evaluate (defaults to now).
 * @returns {number} Difference in minutes.
 */
export function getDiffMinutes(zoneFrom, zoneTo, date = new Date()) {
  return getOffsetMinutes(zoneTo, date) - getOffsetMinutes(zoneFrom, date);
}

/**
 * Render a minute difference as a compact human-readable string.
 * Examples: `+9h`, `-5h`, `+5h30m`, `Same time`.
 *
 * @param {number} minutes - Signed difference in minutes.
 * @returns {string} Formatted gap.
 */
export function formatDiff(minutes) {
  if (minutes === 0) return 'Same time';

  const sign = minutes > 0 ? '+' : '-';
  const abs = Math.abs(minutes);
  const hours = Math.floor(abs / 60);
  const mins = abs % 60;

  return mins === 0 ? `${sign}${hours}h` : `${sign}${hours}h${mins}m`;
}

/**
 * Convenience helper returning the formatted gap of `zoneTo` relative to
 * `zoneFrom` at an instant, correctly accounting for DST/offset.
 *
 * @param {string} zoneFrom - Reference/base IANA zone.
 * @param {string} zoneTo   - Comparison IANA zone.
 * @param {Date}   [date]   - Instant to evaluate (defaults to now).
 * @returns {string} Formatted gap, e.g. "+9h".
 */
export function timeDiff(zoneFrom, zoneTo, date = new Date()) {
  return formatDiff(getDiffMinutes(zoneFrom, zoneTo, date));
}
