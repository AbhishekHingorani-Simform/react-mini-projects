import {
  selectWinner,
  segmentMidAngle,
  computeRotation,
  SPIN_DURATION_MS,
  SPIN_EASING,
} from './spin';

describe('selectWinner', () => {
  test('returns an index within [0, count)', () => {
    for (let i = 0; i < 100; i += 1) {
      const idx = selectWinner(5);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(5);
      expect(Number.isInteger(idx)).toBe(true);
    }
  });

  test('uses the injected RNG (0 -> first index)', () => {
    expect(selectWinner(4, () => 0)).toBe(0);
  });

  test('uses the injected RNG (near-1 -> last index)', () => {
    expect(selectWinner(4, () => 0.999999)).toBe(3);
  });

  test('maps RNG ranges to uniform buckets', () => {
    expect(selectWinner(4, () => 0.0)).toBe(0);
    expect(selectWinner(4, () => 0.25)).toBe(1);
    expect(selectWinner(4, () => 0.5)).toBe(2);
    expect(selectWinner(4, () => 0.75)).toBe(3);
  });

  test('throws when there are fewer than one option', () => {
    expect(() => selectWinner(0)).toThrow();
  });
});

describe('segmentMidAngle', () => {
  test('mid-angle of first of four segments is 45deg', () => {
    expect(segmentMidAngle(0, 4)).toBe(45);
  });

  test('mid-angle of last of four segments is 315deg', () => {
    expect(segmentMidAngle(3, 4)).toBe(315);
  });

  test('single option has a mid-angle of 180deg', () => {
    expect(segmentMidAngle(0, 1)).toBe(180);
  });
});

describe('computeRotation', () => {
  const landsUnderPointer = (rotation, winnerIndex, count) => {
    const landing = (segmentMidAngle(winnerIndex, count) + rotation) % 360;
    return ((landing % 360) + 360) % 360;
  };

  test('lands the winning segment mid under the top pointer (0deg)', () => {
    for (let count = 2; count <= 8; count += 1) {
      for (let winner = 0; winner < count; winner += 1) {
        const rotation = computeRotation({ winnerIndex: winner, count });
        expect(landsUnderPointer(rotation, winner, count)).toBeCloseTo(0, 6);
      }
    }
  });

  test('always rotates forward past the current rotation', () => {
    const current = 1234;
    const rotation = computeRotation({
      winnerIndex: 2,
      count: 6,
      currentRotation: current,
    });
    expect(rotation).toBeGreaterThan(current);
  });

  test('adds at least the requested number of full spins', () => {
    const spins = 5;
    const rotation = computeRotation({
      winnerIndex: 1,
      count: 6,
      currentRotation: 0,
      spins,
    });
    expect(rotation).toBeGreaterThanOrEqual(spins * 360);
  });

  test('is deterministic for the same inputs', () => {
    const args = { winnerIndex: 3, count: 7, currentRotation: 90, spins: 4 };
    expect(computeRotation(args)).toBe(computeRotation(args));
  });

  test('lands correctly even from a non-zero current rotation', () => {
    const rotation = computeRotation({
      winnerIndex: 2,
      count: 5,
      currentRotation: 517,
      spins: 3,
    });
    expect(landsUnderPointer(rotation, 2, 5)).toBeCloseTo(0, 6);
  });
});

describe('spin animation constants', () => {
  test('SPIN_DURATION_MS is a fixed positive duration', () => {
    expect(typeof SPIN_DURATION_MS).toBe('number');
    expect(SPIN_DURATION_MS).toBeGreaterThan(0);
  });

  test('SPIN_EASING is a deceleration (ease-out) curve string', () => {
    expect(typeof SPIN_EASING).toBe('string');
    expect(SPIN_EASING.length).toBeGreaterThan(0);
  });
});
