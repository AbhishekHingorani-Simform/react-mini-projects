import { render, screen, fireEvent } from '@testing-library/react';
import Motivator from './Motivator';

// Mirror the quotes array from the component so tests are self-contained
// and verify exact content without coupling to internal exports.
const QUOTES = [
  "The only way to do great work is to love what you do. \u2013 Steve Jobs",
  "In the middle of every difficulty lies opportunity. \u2013 Albert Einstein",
  "It does not matter how slowly you go as long as you do not stop. \u2013 Confucius",
  "Life is what happens when you\u2019re busy making other plans. \u2013 John Lennon",
  "The future belongs to those who believe in the beauty of their dreams. \u2013 Eleanor Roosevelt",
  "Spread love everywhere you go. Let no one ever come to you without leaving happier. \u2013 Mother Teresa",
  "When you reach the end of your rope, tie a knot in it and hang on. \u2013 Franklin D. Roosevelt",
  "Always remember that you are absolutely unique. Just like everyone else. \u2013 Margaret Mead",
  "Do not go where the path may lead, go instead where there is no path and leave a trail. \u2013 Ralph Waldo Emerson",
  "You will face many defeats in life, but never let yourself be defeated. \u2013 Maya Angelou",
];

describe('Motivator', () => {
  test('shows the first quote on load', () => {
    render(<Motivator />);
    expect(screen.getByTestId('quote-text')).toHaveTextContent(QUOTES[0]);
  });

  test('Next button advances to the second quote', () => {
    render(<Motivator />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByTestId('quote-text')).toHaveTextContent(QUOTES[1]);
  });

  test('wraps from the last quote back to the first', () => {
    render(<Motivator />);
    const nextBtn = screen.getByRole('button', { name: /next/i });

    // Advance to the last quote (index 9 = 9 clicks from index 0)
    for (let i = 0; i < QUOTES.length - 1; i++) {
      fireEvent.click(nextBtn);
    }
    expect(screen.getByTestId('quote-text')).toHaveTextContent(QUOTES[QUOTES.length - 1]);

    // One more click must wrap back to the first quote
    fireEvent.click(nextBtn);
    expect(screen.getByTestId('quote-text')).toHaveTextContent(QUOTES[0]);
  });
});
