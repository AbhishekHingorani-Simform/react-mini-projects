/**
 * ResultHistory — displays a running list of past Decision Wheel spin results.
 *
 * Props:
 *  • history {string[]} — results in most-recent-first order; the caller is
 *    responsible for maintaining this ordering (typically by prepending each
 *    new result to the front of the array).
 *
 * The component is intentionally stateless/pure: all state lives in the parent
 * (DecisionWheel) so it can be cleared, inspected, or persisted there.
 */
const ResultHistory = ({ history = [] }) => {
  if (history.length === 0) {
    return (
      <p
        className="text-muted text-center mt-3 mb-0"
        data-testid="history-empty"
      >
        <small>No spins yet — results will appear here after each spin.</small>
      </p>
    );
  }

  return (
    <div className="w-100 mt-3" data-testid="result-history">
      <h6 className="text-muted mb-2">
        Spin History{' '}
        <span className="badge bg-secondary fw-normal" data-testid="history-count">
          {history.length}
        </span>
      </h6>
      <ol className="list-group list-group-numbered" data-testid="history-list">
        {history.map((item, index) => (
          <li
            key={index}
            className="list-group-item d-flex align-items-center"
            data-testid="history-item"
          >
            {index === 0 && (
              <span className="badge bg-success me-2">Latest</span>
            )}
            {item}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ResultHistory;
