import { useState } from 'react';

export const QUOTES = [
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Don't watch the clock; do what it does. Keep going.",
  "You are never too old to set another goal or to dream a new dream.",
  "The secret of getting ahead is getting started.",
  "Act as if what you do makes a difference. It does.",
  "With the new day comes new strength and new thoughts.",
];

const Motivator = () => {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % QUOTES.length);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh', background: '#f0f4f8' }}
    >
      <div
        className="card shadow-lg text-center p-5"
        style={{ maxWidth: '600px', width: '100%', borderRadius: '1rem' }}
      >
        <div className="card-body">
          <span className="badge bg-primary mb-4" style={{ fontSize: '0.85rem' }}>
            {index + 1} / {QUOTES.length}
          </span>
          <blockquote className="blockquote mb-4">
            <p className="fs-4 fw-semibold text-dark" style={{ lineHeight: '1.6' }}>
              "{QUOTES[index]}"
            </p>
          </blockquote>
          <button
            className="btn btn-primary btn-lg px-5"
            onClick={handleNext}
            style={{ borderRadius: '2rem' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Motivator;
