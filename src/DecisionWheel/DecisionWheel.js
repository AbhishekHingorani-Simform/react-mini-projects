import { useCallback, useEffect, useRef, useState } from 'react';
import OptionsManager from './OptionsManager';
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
 *    are fewer than two options (nothing to decide between).
 */
const DecisionWheel = () => {
  const [options, setOptions] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);

  const canSpin = options.length >= 2 && !spinning;

  // Keep the parent-owned options in sync with the OptionsManager.
  const handleOptionsChange = useCallback((next) => {
    setOptions(next);
    // A changed option set invalidates any previous result.
    setResult(null);
  }, []);

  const handleSpin = () => {
    if (!canSpin) return;

    const winnerIndex = selectWinner(options.length);
    const nextRotation = computeRotation({
      winnerIndex,
      count: options.length,
      currentRotation: rotation,
    });

    setResult(null);
    setSpinning(true);
    setRotation(nextRotation);

    // Reveal the winner exactly when the fixed-duration animation completes.
    timerRef.current = setTimeout(() => {
      setSpinning(false);
      setResult(options[winnerIndex]);
    }, SPIN_DURATION_MS);
  };

  // Clean up a pending reveal timer on unmount.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <>
      <OptionsManager onOptionsChange={handleOptionsChange} />
      <div className="w-100 d-flex justify-content-center pb-5">
        <div
          className="d-flex flex-column align-items-center"
          style={{ maxWidth: '560px', width: '100%' }}
        >
          <Wheel options={options} rotation={rotation} spinning={spinning} />

          <button
            type="button"
            className="btn btn-lg btn-primary mt-2"
            onClick={handleSpin}
            disabled={!canSpin}
            data-testid="spin-button"
          >
            {spinning ? 'Spinning…' : 'Spin'}
          </button>

          {options.length < 2 && (
            <p className="text-muted mt-2 mb-0">
              <small>Add at least two options to spin.</small>
            </p>
          )}

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
        </div>
      </div>
    </>
  );
};

export default DecisionWheel;
