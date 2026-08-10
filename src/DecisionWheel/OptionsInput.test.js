import { render, screen, fireEvent } from '@testing-library/react';
import OptionsInput from './OptionsInput';

describe('OptionsInput', () => {
  // ─── Rendering ────────────────────────────────────────────────────────────

  test('renders the text input and Add button', () => {
    render(<OptionsInput />);
    expect(screen.getByPlaceholderText(/add an option/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^add$/i })).toBeInTheDocument();
  });

  test('shows an empty-state message when no options have been added', () => {
    render(<OptionsInput />);
    expect(screen.getByText(/no options yet/i)).toBeInTheDocument();
  });

  // ─── Adding options ───────────────────────────────────────────────────────

  test('adds a valid option to the list', () => {
    render(<OptionsInput />);
    const input = screen.getByPlaceholderText(/add an option/i);
    fireEvent.change(input, { target: { value: 'Pizza' } });
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(screen.getByText('Pizza')).toBeInTheDocument();
  });

  test('clears the input field after a successful add', () => {
    render(<OptionsInput />);
    const input = screen.getByPlaceholderText(/add an option/i);
    fireEvent.change(input, { target: { value: 'Pizza' } });
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(input.value).toBe('');
  });

  test('can add multiple distinct options', () => {
    render(<OptionsInput />);
    const input = screen.getByPlaceholderText(/add an option/i);
    ['Pizza', 'Pasta', 'Salad'].forEach((opt) => {
      fireEvent.change(input, { target: { value: opt } });
      fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    });
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Pasta')).toBeInTheDocument();
    expect(screen.getByText('Salad')).toBeInTheDocument();
  });

  test('supports adding an option by pressing the Enter key', () => {
    render(<OptionsInput />);
    const input = screen.getByPlaceholderText(/add an option/i);
    fireEvent.change(input, { target: { value: 'Sushi' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText('Sushi')).toBeInTheDocument();
  });

  // ─── Validation: empty / whitespace ──────────────────────────────────────

  test('shows an error and does not add when input is empty', () => {
    render(<OptionsInput />);
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/cannot be empty/i);
    // The list should still be empty
    expect(screen.getByText(/no options yet/i)).toBeInTheDocument();
  });

  test('shows an error and does not add when input is whitespace-only', () => {
    render(<OptionsInput />);
    const input = screen.getByPlaceholderText(/add an option/i);
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/cannot be empty/i);
    expect(screen.getByText(/no options yet/i)).toBeInTheDocument();
  });

  // ─── Validation: duplicates ───────────────────────────────────────────────

  test('shows an error and does not add a duplicate option', () => {
    render(<OptionsInput />);
    const input = screen.getByPlaceholderText(/add an option/i);
    fireEvent.change(input, { target: { value: 'Pizza' } });
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    // Try to add the same option again
    fireEvent.change(input, { target: { value: 'Pizza' } });
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/already exists/i);
    // Only one "Pizza" entry should appear
    expect(screen.getAllByText('Pizza')).toHaveLength(1);
  });

  test('duplicate check is case-insensitive', () => {
    render(<OptionsInput />);
    const input = screen.getByPlaceholderText(/add an option/i);
    fireEvent.change(input, { target: { value: 'Pizza' } });
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    fireEvent.change(input, { target: { value: 'pizza' } });
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/already exists/i);
  });

  // ─── Error clearance ──────────────────────────────────────────────────────

  test('error message disappears after a successful add', () => {
    render(<OptionsInput />);
    const input = screen.getByPlaceholderText(/add an option/i);
    // Trigger an error first
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    // Now add a valid option — the error should vanish
    fireEvent.change(input, { target: { value: 'Pizza' } });
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  // ─── Removing options ─────────────────────────────────────────────────────

  test('removes an option when its Remove button is clicked', () => {
    render(<OptionsInput />);
    const input = screen.getByPlaceholderText(/add an option/i);
    fireEvent.change(input, { target: { value: 'Pizza' } });
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    // Each item has an aria-label="Remove <option>"
    fireEvent.click(screen.getByRole('button', { name: /remove pizza/i }));
    expect(screen.queryByText('Pizza')).not.toBeInTheDocument();
    // Empty-state message should return
    expect(screen.getByText(/no options yet/i)).toBeInTheDocument();
  });

  test('only removes the targeted option, leaving others intact', () => {
    render(<OptionsInput />);
    const input = screen.getByPlaceholderText(/add an option/i);
    ['Pizza', 'Pasta'].forEach((opt) => {
      fireEvent.change(input, { target: { value: opt } });
      fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    });
    fireEvent.click(screen.getByRole('button', { name: /remove pizza/i }));
    expect(screen.queryByText('Pizza')).not.toBeInTheDocument();
    expect(screen.getByText('Pasta')).toBeInTheDocument();
  });

  // ─── Editing options ──────────────────────────────────────────────────────

  test('clicking Edit on an option shows an inline text input pre-filled with its value', () => {
    render(<OptionsInput />);
    const input = screen.getByPlaceholderText(/add an option/i);
    fireEvent.change(input, { target: { value: 'Pizza' } });
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    fireEvent.click(screen.getByRole('button', { name: /edit pizza/i }));
    const editInput = screen.getByDisplayValue('Pizza');
    expect(editInput).toBeInTheDocument();
  });

  test('saving an edited option updates it in the list', () => {
    render(<OptionsInput />);
    const input = screen.getByPlaceholderText(/add an option/i);
    fireEvent.change(input, { target: { value: 'Pizza' } });
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    fireEvent.click(screen.getByRole('button', { name: /edit pizza/i }));
    const editInput = screen.getByDisplayValue('Pizza');
    fireEvent.change(editInput, { target: { value: 'Tacos' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.queryByText('Pizza')).not.toBeInTheDocument();
    expect(screen.getByText('Tacos')).toBeInTheDocument();
  });

  test('saving an empty edit shows an error and does not update the option', () => {
    render(<OptionsInput />);
    const input = screen.getByPlaceholderText(/add an option/i);
    fireEvent.change(input, { target: { value: 'Pizza' } });
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    fireEvent.click(screen.getByRole('button', { name: /edit pizza/i }));
    const editInput = screen.getByDisplayValue('Pizza');
    fireEvent.change(editInput, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/cannot be empty/i);
    expect(screen.getByText('Pizza')).toBeInTheDocument();
  });

  test('saving an edit with a duplicate value shows an error', () => {
    render(<OptionsInput />);
    const input = screen.getByPlaceholderText(/add an option/i);
    ['Pizza', 'Pasta'].forEach((opt) => {
      fireEvent.change(input, { target: { value: opt } });
      fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    });
    // Try to rename "Pasta" to "Pizza"
    fireEvent.click(screen.getByRole('button', { name: /edit pasta/i }));
    const editInput = screen.getByDisplayValue('Pasta');
    fireEvent.change(editInput, { target: { value: 'Pizza' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/already exists/i);
  });

  test('cancelling an edit restores the original value without changes', () => {
    render(<OptionsInput />);
    const input = screen.getByPlaceholderText(/add an option/i);
    fireEvent.change(input, { target: { value: 'Pizza' } });
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    fireEvent.click(screen.getByRole('button', { name: /edit pizza/i }));
    const editInput = screen.getByDisplayValue('Pizza');
    fireEvent.change(editInput, { target: { value: 'Tacos' } });
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.queryByText('Tacos')).not.toBeInTheDocument();
  });
});
