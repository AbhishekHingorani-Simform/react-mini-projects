import { useMemo, useState } from 'react';
import './EMICalculator.css';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

const EMICalculator = () => {
  const [amount, setAmount] = useState(500000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(10.5);

  const { emi, totalInterest, totalPayable } = useMemo(() => {
    const principal = Number(amount);
    const months = Number(years) * 12;
    const monthlyRate = Number(rate) / (12 * 100);

    if (!principal || !months || !monthlyRate) {
      return { emi: 0, totalInterest: 0, totalPayable: principal };
    }

    const factor = Math.pow(1 + monthlyRate, months);
    const monthlyEmi = (principal * monthlyRate * factor) / (factor - 1);
    const payable = monthlyEmi * months;

    return {
      emi: monthlyEmi,
      totalInterest: payable - principal,
      totalPayable: payable,
    };
  }, [amount, years, rate]);

  const principalShare = totalPayable ? (Number(amount) / totalPayable) * 100 : 0;

  return (
    <div className="emi-page">
      <div className="emi-card">
        <header className="emi-card__header">
          <h2>EMI Calculator</h2>
          <p>Estimate your monthly loan repayment.</p>
        </header>

        <div className="emi-controls">
          <div className="emi-field">
            <div className="emi-field__row">
              <label htmlFor="emi-amount">Loan amount</label>
              <span className="emi-field__value">{formatCurrency(Number(amount))}</span>
            </div>
            <input
              id="emi-amount"
              type="range"
              min="50000"
              max="10000000"
              step="10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="emi-field__scale">
              <span>₹50 K</span>
              <span>₹1 Cr</span>
            </div>
          </div>

          <div className="emi-field">
            <div className="emi-field__row">
              <label htmlFor="emi-years">Tenure</label>
              <span className="emi-field__value">
                {years} {Number(years) === 1 ? 'year' : 'years'}
              </span>
            </div>
            <input
              id="emi-years"
              type="range"
              min="1"
              max="30"
              step="1"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
            <div className="emi-field__scale">
              <span>1 yr</span>
              <span>30 yrs</span>
            </div>
          </div>

          <div className="emi-field">
            <div className="emi-field__row">
              <label htmlFor="emi-rate">Interest rate</label>
              <span className="emi-field__value">{Number(rate).toFixed(2)}%</span>
            </div>
            <input
              id="emi-rate"
              type="range"
              min="1"
              max="25"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
            <div className="emi-field__scale">
              <span>1%</span>
              <span>25%</span>
            </div>
          </div>
        </div>

        <div className="emi-result">
          <div className="emi-result__emi">
            <span className="emi-result__label">Monthly EMI</span>
            <span className="emi-result__amount">{formatCurrency(emi)}</span>
          </div>

          <div className="emi-bar" aria-hidden="true">
            <div className="emi-bar__principal" style={{ width: `${principalShare}%` }} />
          </div>

          <div className="emi-breakdown">
            <div>
              <span className="emi-dot emi-dot--principal" />
              Principal
              <strong>{formatCurrency(Number(amount))}</strong>
            </div>
            <div>
              <span className="emi-dot emi-dot--interest" />
              Total interest
              <strong>{formatCurrency(totalInterest)}</strong>
            </div>
            <div>
              <span className="emi-dot emi-dot--total" />
              Total payable
              <strong>{formatCurrency(totalPayable)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
