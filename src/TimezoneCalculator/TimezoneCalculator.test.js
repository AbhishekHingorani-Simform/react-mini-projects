import { render, screen, fireEvent } from '@testing-library/react';
import TimezoneCalculator from './TimezoneCalculator';

// Helper: select a timezone in a given picker.
function selectZone(testIdBase, query, iana) {
  const input = screen.getByTestId(`${testIdBase}-input`);
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: query } });
  fireEvent.mouseDown(screen.getByTestId(`${testIdBase}-option-${iana}`));
}

describe('TimezoneCalculator', () => {
  test('renders two timezone picker inputs', () => {
    render(<TimezoneCalculator />);
    expect(screen.getByTestId('tz-picker-1-input')).toBeInTheDocument();
    expect(screen.getByTestId('tz-picker-2-input')).toBeInTheDocument();
  });

  test('selected zone labels are not shown before any selection', () => {
    render(<TimezoneCalculator />);
    expect(screen.queryByTestId('selected-zone-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('selected-zone-2')).not.toBeInTheDocument();
  });

  // ─── Filtering behaviour ────────────────────────────────────────────────────

  describe('Filtering', () => {
    test('shows matching options when user types "Tokyo" in picker 1', () => {
      render(<TimezoneCalculator />);
      const input = screen.getByTestId('tz-picker-1-input');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Tokyo' } });

      expect(screen.getByTestId('tz-picker-1-option-Asia/Tokyo')).toBeInTheDocument();
      // Non-matching option must not appear
      expect(screen.queryByTestId('tz-picker-1-option-Europe/London')).not.toBeInTheDocument();
    });

    test('shows America/New_York when user types "New_York"', () => {
      render(<TimezoneCalculator />);
      const input = screen.getByTestId('tz-picker-1-input');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'New_York' } });

      expect(screen.getByTestId('tz-picker-1-option-America/New_York')).toBeInTheDocument();
    });

    test('matching is case-insensitive (typing "tokyo" matches Asia/Tokyo)', () => {
      render(<TimezoneCalculator />);
      const input = screen.getByTestId('tz-picker-1-input');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'tokyo' } });

      expect(screen.getByTestId('tz-picker-1-option-Asia/Tokyo')).toBeInTheDocument();
    });

    test('dropdown is hidden when query matches nothing', () => {
      render(<TimezoneCalculator />);
      const input = screen.getByTestId('tz-picker-1-input');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'xyznonexistent' } });

      expect(screen.queryByTestId('tz-picker-1-list')).not.toBeInTheDocument();
    });

    test('picker 2 filters independently of picker 1', () => {
      render(<TimezoneCalculator />);
      const input2 = screen.getByTestId('tz-picker-2-input');
      fireEvent.focus(input2);
      fireEvent.change(input2, { target: { value: 'London' } });

      expect(screen.getByTestId('tz-picker-2-option-Europe/London')).toBeInTheDocument();
      // Picker 1 list must not be open
      expect(screen.queryByTestId('tz-picker-1-list')).not.toBeInTheDocument();
    });
  });

  // ─── Selection behaviour ────────────────────────────────────────────────────

  describe('Selection', () => {
    test('selecting Asia/Tokyo in picker 1 renders the selected zone name', () => {
      render(<TimezoneCalculator />);
      const input = screen.getByTestId('tz-picker-1-input');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Tokyo' } });
      fireEvent.mouseDown(screen.getByTestId('tz-picker-1-option-Asia/Tokyo'));

      expect(screen.getByTestId('selected-zone-1')).toHaveTextContent('Asia/Tokyo');
    });

    test('selecting Europe/London in picker 2 renders the selected zone name', () => {
      render(<TimezoneCalculator />);
      const input = screen.getByTestId('tz-picker-2-input');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'London' } });
      fireEvent.mouseDown(screen.getByTestId('tz-picker-2-option-Europe/London'));

      expect(screen.getByTestId('selected-zone-2')).toHaveTextContent('Europe/London');
    });

    test('two pickers store zones independently in state', () => {
      render(<TimezoneCalculator />);

      // Select zone 1
      const input1 = screen.getByTestId('tz-picker-1-input');
      fireEvent.focus(input1);
      fireEvent.change(input1, { target: { value: 'Tokyo' } });
      fireEvent.mouseDown(screen.getByTestId('tz-picker-1-option-Asia/Tokyo'));

      // Select zone 2
      const input2 = screen.getByTestId('tz-picker-2-input');
      fireEvent.focus(input2);
      fireEvent.change(input2, { target: { value: 'London' } });
      fireEvent.mouseDown(screen.getByTestId('tz-picker-2-option-Europe/London'));

      expect(screen.getByTestId('selected-zone-1')).toHaveTextContent('Asia/Tokyo');
      expect(screen.getByTestId('selected-zone-2')).toHaveTextContent('Europe/London');
    });

    test('dropdown closes after a selection is made', () => {
      render(<TimezoneCalculator />);
      const input = screen.getByTestId('tz-picker-1-input');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Tokyo' } });
      fireEvent.mouseDown(screen.getByTestId('tz-picker-1-option-Asia/Tokyo'));

      expect(screen.queryByTestId('tz-picker-1-list')).not.toBeInTheDocument();
    });

    test('input value is updated to the selected timezone after selection', () => {
      render(<TimezoneCalculator />);
      const input = screen.getByTestId('tz-picker-1-input');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'New_York' } });
      fireEvent.mouseDown(screen.getByTestId('tz-picker-1-option-America/New_York'));

      expect(input.value).toBe('America/New_York');
    });
  });

  // ─── Live time & difference display ──────────────────────────────────────────

  describe('Live time & difference', () => {
    test('shows a live clock for a zone once it is selected', () => {
      render(<TimezoneCalculator />);
      expect(screen.queryByTestId('live-time-1')).not.toBeInTheDocument();

      selectZone('tz-picker-1', 'Tokyo', 'Asia/Tokyo');

      const clock = screen.getByTestId('live-time-1');
      expect(clock).toBeInTheDocument();
      // e.g. "01:23:45 PM" — hours:minutes:seconds present
      expect(clock.textContent).toMatch(/\d{1,2}:\d{2}:\d{2}/);
    });

    test('difference is hidden until BOTH zones are selected', () => {
      render(<TimezoneCalculator />);
      expect(screen.queryByTestId('time-difference')).not.toBeInTheDocument();

      selectZone('tz-picker-1', 'Tokyo', 'Asia/Tokyo');
      // Still only one zone chosen → no difference yet
      expect(screen.queryByTestId('time-difference')).not.toBeInTheDocument();

      selectZone('tz-picker-2', 'London', 'Europe/London');
      expect(screen.getByTestId('time-difference')).toBeInTheDocument();
    });

    test('difference renders in a compact "+/-Nh" (or "Same time") format', () => {
      render(<TimezoneCalculator />);
      selectZone('tz-picker-1', 'Tokyo', 'Asia/Tokyo');
      selectZone('tz-picker-2', 'London', 'Europe/London');

      const diff = screen.getByTestId('time-difference');
      expect(diff.textContent).toMatch(/^(Same time|[+-]\d+h(\d+m)?)$/);
    });

    test('difference caption names both zones and their direction', () => {
      render(<TimezoneCalculator />);
      selectZone('tz-picker-1', 'New_York', 'America/New_York');
      selectZone('tz-picker-2', 'Tokyo', 'Asia/Tokyo');

      const caption = screen.getByTestId('time-difference-caption');
      expect(caption).toHaveTextContent('Asia/Tokyo');
      expect(caption).toHaveTextContent('America/New_York');
    });
  });
});
