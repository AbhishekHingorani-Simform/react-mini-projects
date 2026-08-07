import { useState } from 'react';

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

const Motivator = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const handleNext = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % QUOTES.length);
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: '100vh', padding: '2rem' }}
    >
      <h1 className="mb-4">Motivator</h1>
      <p
        className="text-center fs-5 mb-4"
        style={{ maxWidth: '600px' }}
        data-testid="quote-text"
      >
        {QUOTES[currentQuoteIndex]}
      </p>
      <button className="btn btn-primary px-4 py-2" onClick={handleNext}>
        Next
      </button>
    </div>
  );
};

export default Motivator;
