import { useState, useRef, useEffect } from 'react';
import TIMEZONES from './timezones';
import { timeDiff } from './timeDiff';

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
 * Format an instant as the live local time in a given IANA zone.
 * Uses Intl.DateTimeFormat so DST/offset are always resolved correctly.
 */
function formatLiveTime(timeZone, date) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * TimezoneCalculator — renders two independent searchable timezone pickers,
 * shows the live local time in each (ticking every second) and prominently
 * displays the current gap between them, accounting for DST/offset.
 */
function TimezoneCalculator() {
  const [zone1, setZone1] = useState('');
  const [zone2, setZone2] = useState('');
  const [now, setNow] = useState(() => new Date());

  // Tick once per second to keep the displayed clocks and gap live.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

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
                <>
                  <p className="mb-1 text-success" data-testid="selected-zone-1">
                    Selected: <strong>{zone1}</strong>
                  </p>
                  <div
                    className="fs-3 fw-bold font-monospace"
                    data-testid="live-time-1"
                  >
                    {formatLiveTime(zone1, now)}
                  </div>
                </>
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
                <>
                  <p className="mb-1 text-success" data-testid="selected-zone-2">
                    Selected: <strong>{zone2}</strong>
                  </p>
                  <div
                    className="fs-3 fw-bold font-monospace"
                    data-testid="live-time-2"
                  >
                    {formatLiveTime(zone2, now)}
                  </div>
                </>
              ) : (
                <p className="mb-0 text-muted fst-italic">No timezone selected</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Prominent time difference ── */}
      {zone1 && zone2 && (
        <div className="text-center mt-4 p-4 bg-light rounded shadow-sm">
          <p className="text-muted text-uppercase small mb-1">Time difference</p>
          <div className="display-3 fw-bold" data-testid="time-difference">
            {timeDiff(zone1, zone2, now)}
          </div>
          <p className="text-muted mb-0" data-testid="time-difference-caption">
            <strong>{zone2}</strong> relative to <strong>{zone1}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default TimezoneCalculator;
