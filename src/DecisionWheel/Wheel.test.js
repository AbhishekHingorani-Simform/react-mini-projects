import { render, screen } from '@testing-library/react';
import Wheel from './Wheel';

describe('Wheel', () => {
  // ─── Empty state ──────────────────────────────────────────────────────────

  test('renders an empty-state message when there are no options', () => {
    render(<Wheel options={[]} />);
    expect(screen.getByText(/add options to build the wheel/i)).toBeInTheDocument();
    expect(screen.queryAllByTestId('wheel-segment')).toHaveLength(0);
  });

  test('defaults to the empty state when no options prop is provided', () => {
    render(<Wheel />);
    expect(screen.getByText(/add options to build the wheel/i)).toBeInTheDocument();
  });

  // ─── Segments ───────────────────────────────────────────────────────────

  test('renders exactly one segment per option', () => {
    render(<Wheel options={['Pizza', 'Pasta', 'Salad']} />);
    expect(screen.getAllByTestId('wheel-segment')).toHaveLength(3);
  });

  test('renders each option label', () => {
    render(<Wheel options={['Pizza', 'Pasta']} />);
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Pasta')).toBeInTheDocument();
  });

  test('renders a single full segment for a single option', () => {
    render(<Wheel options={['Only']} />);
    expect(screen.getAllByTestId('wheel-segment')).toHaveLength(1);
    expect(screen.getByText('Only')).toBeInTheDocument();
  });

  // ─── Equal-size / colours ─────────────────────────────────────────────────

  test('assigns a distinct colour to each segment', () => {
    render(<Wheel options={['A', 'B', 'C', 'D']} />);
    const fills = screen
      .getAllByTestId('wheel-segment')
      .map((seg) => seg.getAttribute('fill'));
    expect(new Set(fills).size).toBe(fills.length);
  });

  test('draws slices as equal-angle pie paths (equal probability)', () => {
    // With 4 options each slice spans 90°; the large-arc flag must be 0.
    render(<Wheel options={['A', 'B', 'C', 'D']} />);
    screen.getAllByTestId('wheel-segment').forEach((seg) => {
      const d = seg.getAttribute('d');
      expect(d).toMatch(/A 90 90 0 0 0/);
    });
  });

  // ─── Pointer ───────────────────────────────────────────────────────────

  test('renders a fixed pointer marking the winning position', () => {
    render(<Wheel options={['A', 'B']} />);
    expect(screen.getByTestId('wheel-pointer')).toBeInTheDocument();
  });

  test('exposes an accessible label describing the wheel', () => {
    render(<Wheel options={['A', 'B', 'C']} />);
    expect(
      screen.getByRole('img', { name: /decision wheel with 3 options/i })
    ).toBeInTheDocument();
  });

  // ─── Reactivity ───────────────────────────────────────────────────────────

  test('updates reactively when options are added', () => {
    const { rerender } = render(<Wheel options={['A', 'B']} />);
    expect(screen.getAllByTestId('wheel-segment')).toHaveLength(2);
    rerender(<Wheel options={['A', 'B', 'C', 'D']} />);
    expect(screen.getAllByTestId('wheel-segment')).toHaveLength(4);
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  test('updates reactively when options are removed', () => {
    const { rerender } = render(<Wheel options={['A', 'B', 'C']} />);
    expect(screen.getAllByTestId('wheel-segment')).toHaveLength(3);
    rerender(<Wheel options={['A']} />);
    expect(screen.getAllByTestId('wheel-segment')).toHaveLength(1);
    expect(screen.queryByText('B')).not.toBeInTheDocument();
  });
});
