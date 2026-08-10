import { render, screen } from '@testing-library/react';
import ResultHistory from './ResultHistory';

describe('ResultHistory', () => {
  // ─── Empty state ──────────────────────────────────────────────────────────

  test('shows an empty-state message when history is an empty array', () => {
    render(<ResultHistory history={[]} />);
    expect(screen.getByTestId('history-empty')).toBeInTheDocument();
    expect(screen.getByTestId('history-empty')).toHaveTextContent(/no spins yet/i);
  });

  test('shows an empty-state message when no history prop is provided', () => {
    render(<ResultHistory />);
    expect(screen.getByTestId('history-empty')).toBeInTheDocument();
  });

  test('does not render the history list in empty state', () => {
    render(<ResultHistory history={[]} />);
    expect(screen.queryByTestId('result-history')).not.toBeInTheDocument();
    expect(screen.queryByTestId('history-list')).not.toBeInTheDocument();
  });

  // ─── Non-empty state ──────────────────────────────────────────────────────

  test('renders the history container when there is at least one result', () => {
    render(<ResultHistory history={['Pizza']} />);
    expect(screen.getByTestId('result-history')).toBeInTheDocument();
    expect(screen.queryByTestId('history-empty')).not.toBeInTheDocument();
  });

  test('renders exactly one list item per history entry', () => {
    render(<ResultHistory history={['Pizza', 'Pasta', 'Salad']} />);
    expect(screen.getAllByTestId('history-item')).toHaveLength(3);
  });

  test('renders each result value in the list', () => {
    render(<ResultHistory history={['Pizza', 'Pasta', 'Salad']} />);
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Pasta')).toBeInTheDocument();
    expect(screen.getByText('Salad')).toBeInTheDocument();
  });

  test('renders a single entry correctly', () => {
    render(<ResultHistory history={['Tacos']} />);
    expect(screen.getAllByTestId('history-item')).toHaveLength(1);
    expect(screen.getByText('Tacos')).toBeInTheDocument();
  });

  // ─── Order (most-recent-first) ────────────────────────────────────────────

  test('renders results in the given order (first element = most recent)', () => {
    render(<ResultHistory history={['Third spin', 'Second spin', 'First spin']} />);
    const items = screen.getAllByTestId('history-item');
    expect(items[0]).toHaveTextContent('Third spin');
    expect(items[1]).toHaveTextContent('Second spin');
    expect(items[2]).toHaveTextContent('First spin');
  });

  test('marks the first item (most recent) with a "Latest" badge', () => {
    render(<ResultHistory history={['Newest', 'Older']} />);
    const items = screen.getAllByTestId('history-item');
    expect(items[0]).toHaveTextContent(/latest/i);
    expect(items[1]).not.toHaveTextContent(/latest/i);
  });

  // ─── Count badge ──────────────────────────────────────────────────────────

  test('displays the number of history entries in the count badge', () => {
    render(<ResultHistory history={['A', 'B', 'C']} />);
    expect(screen.getByTestId('history-count')).toHaveTextContent('3');
  });

  test('updates the count badge for a single entry', () => {
    render(<ResultHistory history={['Solo']} />);
    expect(screen.getByTestId('history-count')).toHaveTextContent('1');
  });

  // ─── Reactivity ───────────────────────────────────────────────────────────

  test('transitions from empty state to populated state on rerender', () => {
    const { rerender } = render(<ResultHistory history={[]} />);
    expect(screen.getByTestId('history-empty')).toBeInTheDocument();

    rerender(<ResultHistory history={['Pizza']} />);
    expect(screen.queryByTestId('history-empty')).not.toBeInTheDocument();
    expect(screen.getByTestId('result-history')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
  });

  test('adds new items at the top when the history array grows (prepend pattern)', () => {
    const { rerender } = render(<ResultHistory history={['First']} />);
    rerender(<ResultHistory history={['Second', 'First']} />);

    const items = screen.getAllByTestId('history-item');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Second');
    expect(items[1]).toHaveTextContent('First');
  });

  test('transitions back to empty state when history is cleared', () => {
    const { rerender } = render(<ResultHistory history={['Pizza', 'Pasta']} />);
    expect(screen.getAllByTestId('history-item')).toHaveLength(2);

    rerender(<ResultHistory history={[]} />);
    expect(screen.queryByTestId('history-list')).not.toBeInTheDocument();
    expect(screen.getByTestId('history-empty')).toBeInTheDocument();
  });
});
