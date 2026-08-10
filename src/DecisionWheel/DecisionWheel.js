import { useCallback, useEffect, useRef, useState } from 'react';
import OptionsManager from './OptionsManager';
import ResultHistory from './ResultHistory';
import Wheel from './Wheel';
import { selectWinner, computeRotation, SPIN_DURATION_MS } from './spin';

/**
 * DecisionWheel — entry point for the Decision Wheel mini-project.
 *
 * Renders the OptionsManager (which owns the list of choices) and a reactive
 * Wheel visualisation below it. The options list is lifted here via the
 * OptionsManager `onOptionsChange` callback so the Wheel re-renders whenever
 * options are added, edited, or removed.
 *
 * Spinning:
 *  • The Spin button picks a uniform-random winner (all landing math lives in
 *    the pure `spin.js` helpers), then rotates the wheel for a fixed duration
 *    with a deceleration easing curve so the winning segment settles under the
 *    top pointer.
 *  • The result is revealed the moment the wheel stops.
 *  • Spinning is disabled while an animation is in flight and whenever there
 *    are fewer than two *active* options on the wheel (nothing to decide between).
 *
 * Optional enhancements (both toggleable in the UI):
 *  • Result history — a most-recent-first list of every past spin result,
 *    displayed beneath the Spin button and updated as soon as each animation
 *    completes.
 *  • Remove winner after spin — when enabled, the winning option is quietly
 *    excluded from the wheel after each spin so subsequent spins choose from
 *    the remaining options.  The exclusion list resets whenever the user edits
 *    the options in OptionsManager (add / remove / rename triggers a reset so
 *    the wheel always reflects the current list from scratch).
 */
const DecisionWheel = () => {
  // ─── Core state ───────────────────────────────────────────────────────────

  // Full options list kept in sync with OptionsManager.
  const [options, setOptions] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);

  // ─── Enhancement state ────────────────────────────────────────────────────

  // Running history of spin results, most-recent-first.
  const [history, setHistory] = useState([]);

  // When true, each winning option is removed from the wheel after it's chosen.
  const [removeAfterSpin, setRemoveAfterSpin] = useState(false);

  // Options currently excluded from the wheel (accumulated when removeAfterSpin
  // is active).  Stored as an array so React can detect reference changes;
  // membership tested with Array#includes for simplicity (lists are small).
  const [excluded, setExcluded] = useState([]);

  // ─── Derived values ───────────────────────────────────────────────────────

  // The subset of options currently active on the wheel.
  // IMPORTANT: both the Wheel SVG and computeRotation operate on this filtered
  // list so that segment geometry and rotation math stay perfectly in sync.
  const wheelOptions = options.filter((o) => !excluded.includes(o));

  const canSpin = wheelOptions.length >= 2 && !spinning;

  // ─── OptionsManager sync ──────────────────────────────────────────────────

  // Keep the parent-owned options in sync with the OptionsManager.
  // Any change to the options list (add / edit / remove) resets the exclusion
  // list so the wheel always reflects the full current set.
  const handleOptionsChange = useCallback((next) => {
    setOptions(next);
    setResult(null);
    setExcluded([]);
  }, []);

  // ─── Spin ─────────────────────────────────────────────────────────────────

  const handleSpin = () => {
    if (!canSpin) return;

    // Select the winner from the *active* wheel options only.
    const winnerIndex = selectWinner(wheelOptions.length);
    const winner = wheelOptions[winnerIndex];

    // computeRotation uses the same count as the Wheel SVG (wheelOptions.length)
    // so the calculated mid-angle matches the rendered segment position exactly.
    const nextRotation = computeRotation({
      winnerIndex,
      count: wheelOptions.length,
      currentRotation: rotation,
    });

    setResult(null);
    setSpinning(true);
    setRotation(nextRotation);

    // Reveal the winner exactly when the fixed-duration animation completes.
    timerRef.current = setTimeout(() => {
      setSpinning(false);
      setResult(winner);

      // Prepend to history (most-recent-first).
      setHistory((prev) => [winner, ...prev]);

      // Optionally exclude the winner from future spins.
      if (removeAfterSpin) {
        setExcluded((prev) => [...prev, winner]);
      }
    }, SPIN_DURATION_MS);
  };

  // Clean up a pending reveal timer on unmount.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <OptionsManager onOptionsChange={handleOptionsChange} />
      <div className="w-100 d-flex justify-content-center pb-5">
        <div
          className="d-flex flex-column align-items-center"
          style={{ maxWidth: '560px', width: '100%' }}
        >
          {/* Wheel renders only the active (non-excluded) options so its
              segment geometry always matches what computeRotation calculated. */}
          <Wheel options={wheelOptions} rotation={rotation} spinning={spinning} />

          {/* ── Spin button ─────────────────────────────────────────── */}
          <button
            type="button"
            className="btn btn-lg btn-primary mt-2"
            onClick={handleSpin}
            disabled={!canSpin}
            data-testid="spin-button"
          >
            {spinning ? 'Spinning…' : 'Spin'}
          </button>

          {wheelOptions.length < 2 && !spinning && (
            <p className="text-muted mt-2 mb-0">
              <small>
                {options.length < 2
                  ? 'Add at least two options to spin.'
                  : 'All options have been used — add more or reset the list.'}
              </small>
            </p>
          )}

          {/* ── Spin result ─────────────────────────────────────────── */}
          {result !== null && (
            <div
              role="status"
              aria-live="polite"
              className="alert alert-success text-center mt-3 mb-0 w-100"
              data-testid="spin-result"
            >
              <span className="text-muted d-block">
                <small>Winner</small>
              </span>
              <strong className="fs-4">{result}</strong>
            </div>
          )}

          {/* ── Remove-after-spin toggle ─────────────────────────────── */}
          <div
            className="form-check mt-3 align-self-start"
            data-testid="remove-toggle-wrapper"
          >
            <input
              className="form-check-input"
              type="checkbox"
              id="removeAfterSpin"
              checked={removeAfterSpin}
              onChange={(e) => setRemoveAfterSpin(e.target.checked)}
              data-testid="remove-after-spin-toggle"
            />
            <label className="form-check-label text-muted" htmlFor="removeAfterSpin">
              <small>Remove winner from wheel after each spin</small>
            </label>
          </div>

          {/* ── Result history ───────────────────────────────────────── */}
          <ResultHistory history={history} />
        </div>
      </div>
    </>
  );
};

export default DecisionWheel;
