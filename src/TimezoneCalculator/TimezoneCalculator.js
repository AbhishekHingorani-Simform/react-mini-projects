import { useState, useRef, useEffect } from 'react';
import TIMEZONES from './timezones';

/**
 * TimezonePicker — a single searchable/filterable timezone combobox.
 *
 * Props:
 *  label    {string}   — visible label for the input
 *  value    {string}   — currently selected IANA timezone string
 *  onChange {function} — called with the newly selected timezone string
 *  testId   {string}   — base data-testid; child elements append a suffix
 */
function TimezonePicker({ label, value, onChange, testId }) {
  const [query, setQuery] = useState(value || '');
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Derive filtered list from current query (case-insensitive substring match)
  const filtered = query
    ? TIMEZONES.filter((tz) =>
        tz.toLowerCase().includes(query.toLowerCase())
      )
    : TIMEZONES;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleInputChange(e) {
    setQuery(e.target.value);
    setOpen(true);
  }

  // mouseDown fires before the input loses focus, so the dropdown is still
  // mounted when the user clicks an option.
  function handleSelect(tz) {
    setQuery(tz);
    setOpen(false);
    onChange(tz);
  }

  return (
    <div className="mb-3 position-relative" ref={containerRef} data-testid={testId}>
      <label className="form-label fw-semibold">{label}</label>
      <input
        type="text"
        className="form-control"
        placeholder="Type a city or IANA name…"
        value={query}
        autoComplete="off"
        onChange={handleInputChange}
        onFocus={() => setOpen(true)}
        data-testid={`${testId}-input`}
        aria-autocomplete="list"
        aria-expanded={open}
        role="combobox"
      />
      {open && filtered.length > 0 && (
        <ul
          className="list-group position-absolute w-100 overflow-auto shadow-sm"
          style={{ maxHeight: 220, zIndex: 1000, top: '100%' }}
          data-testid={`${testId}-list`}
          role="listbox"
        >
          {filtered.map((tz) => (
            <li
              key={tz}
              className="list-group-item list-group-item-action"
              style={{ cursor: 'pointer' }}
              onMouseDown={() => handleSelect(tz)}
              data-testid={`${testId}-option-${tz}`}
              role="option"
              aria-selected={tz === value}
            >
              {tz}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * TimezoneCalculator — renders two independent searchable timezone pickers
 * and stores the selected IANA timezone string for each in component state.
 */
function TimezoneCalculator() {
  const [zone1, setZone1] = useState('');
  const [zone2, setZone2] = useState('');

  return (
    <div className="container py-4">
      <h2 className="mb-1">Timezone Selector</h2>
      <p className="text-muted mb-4">
        Search by city or IANA name (e.g.&nbsp;<em>America/New_York</em>,&nbsp;
        <em>Tokyo</em>).
      </p>

      <div className="row g-4">
        {/* ── Picker 1 ── */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <TimezonePicker
                label="Timezone 1"
                value={zone1}
                onChange={setZone1}
                testId="tz-picker-1"
              />
              {zone1 ? (
                <p className="mb-0 text-success" data-testid="selected-zone-1">
                  Selected: <strong>{zone1}</strong>
                </p>
              ) : (
                <p className="mb-0 text-muted fst-italic">No timezone selected</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Picker 2 ── */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <TimezonePicker
                label="Timezone 2"
                value={zone2}
                onChange={setZone2}
                testId="tz-picker-2"
              />
              {zone2 ? (
                <p className="mb-0 text-success" data-testid="selected-zone-2">
                  Selected: <strong>{zone2}</strong>
                </p>
              ) : (
                <p className="mb-0 text-muted fst-italic">No timezone selected</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimezoneCalculator;
