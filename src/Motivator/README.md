# Motivator

A simple React mini-project that displays an inspiring quote and lets you cycle through a curated list of 10 motivational sayings.

## Features

- Displays one motivational quote at a time, centred on the page
- **Next** button advances to the next quote, wrapping back to the first after the last
- Quote resets to the first entry on every page remount (no persistence)
- Fully responsive — long quotes wrap naturally on any screen width

## Quotes included

1. Steve Jobs — *"The only way to do great work is to love what you do."*
2. Albert Einstein — *"In the middle of every difficulty lies opportunity."*
3. Confucius — *"It does not matter how slowly you go as long as you do not stop."*
4. John Lennon — *"Life is what happens when you're busy making other plans."*
5. Eleanor Roosevelt — *"The future belongs to those who believe in the beauty of their dreams."*
6. Mother Teresa — *"Spread love everywhere you go…"*
7. Franklin D. Roosevelt — *"When you reach the end of your rope, tie a knot in it and hang on."*
8. Margaret Mead — *"Always remember that you are absolutely unique. Just like everyone else."*
9. Ralph Waldo Emerson — *"Do not go where the path may lead, go instead where there is no path and leave a trail."*
10. Maya Angelou — *"You will face many defeats in life, but never let yourself be defeated."*

## How it works

```
QUOTES array (10 items)
  └─ currentQuoteIndex state  (initial: 0)
       └─ displays QUOTES[currentQuoteIndex]
            └─ Next button: setCurrentQuoteIndex((prev) => (prev + 1) % QUOTES.length)
```

## Running the project

```bash
# From the repository root
npm start        # development server
npm test         # run all tests
```

To run only the Motivator tests:

```bash
npm test -- --watchAll=false src/Motivator
```

## File structure

```
src/Motivator/
  ├── Motivator.js        # Component
  ├── Motivator.test.js   # Unit tests
  └── README.md           # This file
```

## Tech stack

- React (functional component + `useState`)
- Bootstrap 5 utility classes for layout and button styling
- `@testing-library/react` + `@testing-library/jest-dom` for tests
