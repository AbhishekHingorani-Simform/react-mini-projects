/**
 * spin — pure helpers for the Decision Wheel's spin behaviour.
 *
 * The wheel is drawn with segment `i` occupying the clockwise arc
 * [i * sliceAngle, (i + 1) * sliceAngle] measured from 12 o'clock (0°),
 * where sliceAngle = 360 / count. A fixed pointer sits at the top (0°).
 *
 * These functions contain all of the landing math so it can be unit-tested
 * in isolation from React / the DOM:
 *   • selectWinner     — uniform random winning index (RNG injectable)
 *   • segmentMidAngle  — mid-angle of a segment (clockwise from the top)
 *   • computeRotation  — absolute rotation that lands a winner under the pointer
 *
 * Animation is a *fixed duration* with a deceleration (ease-out) easing curve,
 * exported as constants so the component and any tests share one source.
 */

// Fixed spin duration (ms) — every spin takes the same time regardless of how
// far the wheel must travel.
export const SPIN_DURATION_MS = 4000;

// Deceleration easing: fast start, smooth slow-down as the wheel settles.
export const SPIN_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

// Default number of full rotations before the wheel settles on the winner.
export const DEFAULT_SPINS = 5;

const normalizeAngle = (angle) => ((angle % 360) + 360) % 360;

/**
 * Pick a winning option index uniformly at random.
 *
 * @param {number} count       number of options (must be >= 1)
 * @param {() => number} rng   RNG returning a float in [0, 1); defaults to Math.random
 * @returns {number}           an integer index in [0, count)
 */
export const selectWinner = (count, rng = Math.random) => {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(`selectWinner requires at least one option, got ${count}`);
  }
  const idx = Math.floor(rng() * count);
  // Guard against rng() returning exactly 1 (out of spec) landing us off the end.
  return Math.min(idx, count - 1);
};

/**
 * Mid-angle (degrees, clockwise from the top) of segment `index` of `count`.
 */
export const segmentMidAngle = (index, count) => {
  const sliceAngle = 360 / count;
  return index * sliceAngle + sliceAngle / 2;
};

/**
 * Compute the absolute rotation (degrees) to apply so that the winning
 * segment's mid-angle lands directly under the top pointer.
 *
 * The result is always greater than `currentRotation` (the wheel only ever
 * spins forward) and includes at least `spins` full rotations, giving a
 * consistent, satisfying spin no matter which segment wins.
 *
 * @param {object}  args
 * @param {number}  args.winnerIndex      index of the winning segment
 * @param {number}  args.count            total number of segments
 * @param {number} [args.currentRotation] current rotation of the wheel (deg)
 * @param {number} [args.spins]           minimum full rotations to add
 * @returns {number} absolute target rotation in degrees
 */
export const computeRotation = ({
  winnerIndex,
  count,
  currentRotation = 0,
  spins = DEFAULT_SPINS,
}) => {
  // Rotation R such that (midAngle + R) ≡ 0 (mod 360) => R ≡ -midAngle (mod 360)
  const targetMod = normalizeAngle(-segmentMidAngle(winnerIndex, count));

  const minRotation = currentRotation + spins * 360;
  const delta = normalizeAngle(targetMod - normalizeAngle(minRotation));

  return minRotation + delta;
};
