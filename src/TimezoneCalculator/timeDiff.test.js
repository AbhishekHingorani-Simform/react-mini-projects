import {
  getOffsetMinutes,
  getDiffMinutes,
  formatDiff,
  timeDiff,
} from './timeDiff';

// Fixed instants so DST behaviour is deterministic regardless of when
// the suite runs.
const SUMMER = new Date('2024-07-01T12:00:00Z'); // Northern-hemisphere summer
const WINTER = new Date('2024-01-01T12:00:00Z'); // Northern-hemisphere winter

describe('getOffsetMinutes', () => {
  test('UTC has a zero offset', () => {
    expect(getOffsetMinutes('UTC', SUMMER)).toBe(0);
  });

  test('Asia/Kolkata is a fixed +5h30m (330 min) with no DST', () => {
    expect(getOffsetMinutes('Asia/Kolkata', SUMMER)).toBe(330);
    expect(getOffsetMinutes('Asia/Kolkata', WINTER)).toBe(330);
  });

  test('Asia/Tokyo is a fixed +9h (540 min) with no DST', () => {
    expect(getOffsetMinutes('Asia/Tokyo', SUMMER)).toBe(540);
    expect(getOffsetMinutes('Asia/Tokyo', WINTER)).toBe(540);
  });

  describe('DST awareness', () => {
    test('America/New_York shifts between EDT (-4h) and EST (-5h)', () => {
      expect(getOffsetMinutes('America/New_York', SUMMER)).toBe(-240); // EDT
      expect(getOffsetMinutes('America/New_York', WINTER)).toBe(-300); // EST
    });

    test('Europe/London shifts between BST (+1h) and GMT (0)', () => {
      expect(getOffsetMinutes('Europe/London', SUMMER)).toBe(60); // BST
      expect(getOffsetMinutes('Europe/London', WINTER)).toBe(0); // GMT
    });

    test('Australia/Sydney observes reversed (Southern) DST', () => {
      expect(getOffsetMinutes('Australia/Sydney', SUMMER)).toBe(600); // AEST (winter there)
      expect(getOffsetMinutes('Australia/Sydney', WINTER)).toBe(660); // AEDT (summer there)
    });
  });
});

describe('getDiffMinutes', () => {
  test('difference is zero for identical zones', () => {
    expect(getDiffMinutes('Asia/Tokyo', 'Asia/Tokyo', SUMMER)).toBe(0);
  });

  test('New_York -> Tokyo widens from 13h to 14h across DST', () => {
    // Summer: Tokyo(540) - NY(-240) = 780 min = 13h
    expect(getDiffMinutes('America/New_York', 'Asia/Tokyo', SUMMER)).toBe(780);
    // Winter: Tokyo(540) - NY(-300) = 840 min = 14h
    expect(getDiffMinutes('America/New_York', 'Asia/Tokyo', WINTER)).toBe(840);
  });

  test('difference is signed by direction', () => {
    expect(getDiffMinutes('UTC', 'Asia/Kolkata', SUMMER)).toBe(330);
    expect(getDiffMinutes('Asia/Kolkata', 'UTC', SUMMER)).toBe(-330);
  });
});

describe('formatDiff', () => {
  test('formats a positive whole-hour difference', () => {
    expect(formatDiff(540)).toBe('+9h');
  });

  test('formats a negative whole-hour difference', () => {
    expect(formatDiff(-300)).toBe('-5h');
  });

  test('includes minutes for fractional-hour offsets', () => {
    expect(formatDiff(330)).toBe('+5h30m');
    expect(formatDiff(-330)).toBe('-5h30m');
  });

  test('reports identical zones as "Same time"', () => {
    expect(formatDiff(0)).toBe('Same time');
  });
});

describe('timeDiff (end-to-end formatted string)', () => {
  const cases = [
    ['America/New_York', 'Asia/Tokyo', SUMMER, '+13h'],
    ['America/New_York', 'Asia/Tokyo', WINTER, '+14h'],
    ['Europe/London', 'Asia/Kolkata', SUMMER, '+4h30m'], // Kolkata 330 - London 60
    ['Asia/Tokyo', 'America/New_York', WINTER, '-14h'],
    ['UTC', 'UTC', SUMMER, 'Same time'],
    ['America/Los_Angeles', 'America/New_York', SUMMER, '+3h'], // NY(-240) - LA(-420)
  ];

  test.each(cases)(
    'timeDiff(%s, %s) === %s',
    (from, to, date, expected) => {
      expect(timeDiff(from, to, date)).toBe(expected);
    }
  );
});
