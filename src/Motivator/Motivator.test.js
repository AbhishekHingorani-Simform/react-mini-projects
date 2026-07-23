import { render, screen, fireEvent } from '@testing-library/react';
import Motivator from './Motivator';

// Import the quotes directly so tests are data-driven and won't break
// if the quote text changes, as long as the cycling logic is correct.
// We also do a whitebox check for the first and last quotes by text.
import { QUOTES } from './Motivator';

describe('Motivator', () => {
  test('renders the first quote on mount', () => {
    render(<Motivator />);
    expect(screen.getByText(QUOTES[0])).toBeInTheDocument();
  });

  test('clicking Next advances to the second quote', () => {
    render(<Motivator />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText(QUOTES[1])).toBeInTheDocument();
  });

  test('advances sequentially through all 10 quotes', () => {
    render(<Motivator />);
    const nextBtn = screen.getByRole('button', { name: /next/i });

    for (let i = 0; i < QUOTES.length; i++) {
      expect(screen.getByText(QUOTES[i])).toBeInTheDocument();
      if (i < QUOTES.length - 1) {
        fireEvent.click(nextBtn);
      }
    }
  });

  test('cycles from quote 10 back to quote 1 after clicking Next', () => {
    render(<Motivator />);
    const nextBtn = screen.getByRole('button', { name: /next/i });

    // Advance through all 10 quotes to land on the last one
    for (let i = 0; i < QUOTES.length - 1; i++) {
      fireEvent.click(nextBtn);
    }
    // Now on quote 10 (index 9)
    expect(screen.getByText(QUOTES[9])).toBeInTheDocument();

    // One more click should wrap back to quote 1 (index 0)
    fireEvent.click(nextBtn);
    expect(screen.getByText(QUOTES[0])).toBeInTheDocument();
  });
});
