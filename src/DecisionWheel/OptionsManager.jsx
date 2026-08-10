import { useState } from 'react';

/**
 * OptionsManager — manages the list of choices for the Decision Wheel.
 *
 * Features:
 *  • Add option via button click or Enter key
 *  • Inline edit with Save / Cancel
 *  • Per-item Remove button
 *  • Validation: rejects empty/whitespace-only and duplicate entries
 *    (case-insensitive); surfaces errors via an inline alert
 */
const OptionsManager = () => {
  const [options, setOptions]       = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError]           = useState('');
  // editIndex: null = not editing; number = index being edited
  const [editIndex, setEditIndex]   = useState(null);
  const [editValue, setEditValue]   = useState('');

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const isDuplicate = (value, excludeIndex = -1) =>
    options.some(
      (opt, i) => i !== excludeIndex && opt.toLowerCase() === value.toLowerCase()
    );

  // ─── Add ──────────────────────────────────────────────────────────────────

  const handleAdd = () => {
    const trimmed = inputValue.trim();

    if (!trimmed) {
      setError('Option cannot be empty.');
      return;
    }

    if (isDuplicate(trimmed)) {
      setError(`"${trimmed}" already exists in the list.`);
      return;
    }

    setOptions((prev) => [...prev, trimmed]);
    setInputValue('');
    setError('');
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  // ─── Remove ───────────────────────────────────────────────────────────────

  const handleRemove = (index) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
    // If the removed item was being edited, cancel that edit
    if (editIndex === index) {
      setEditIndex(null);
      setEditValue('');
    }
    setError('');
  };

  // ─── Edit ─────────────────────────────────────────────────────────────────

  const startEdit = (index) => {
    setEditIndex(index);
    setEditValue(options[index]);
    setError('');
  };

  const handleSave = () => {
    const trimmed = editValue.trim();

    if (!trimmed) {
      setError('Option cannot be empty.');
      return;
    }

    if (isDuplicate(trimmed, editIndex)) {
      setError(`"${trimmed}" already exists in the list.`);
      return;
    }

    setOptions((prev) =>
      prev.map((opt, i) => (i === editIndex ? trimmed : opt))
    );
    setEditIndex(null);
    setEditValue('');
    setError('');
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditValue('');
    setError('');
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className="d-flex flex-column align-items-center"
      style={{ minHeight: '100vh', padding: '2rem' }}
    >
      <div className="w-100" style={{ maxWidth: '560px' }}>
        <h2 className="mb-1">Decision Wheel</h2>
        <p className="text-muted mb-4">Add your choices, then spin to decide!</p>

        {/* ── Add input ─────────────────────────────────────── */}
        <div className="input-group mb-2">
          <input
            type="text"
            className={`form-control${error && editIndex === null ? ' is-invalid' : ''}`}
            placeholder="Add an option..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            aria-label="New option"
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>

        {/* ── Validation alert ──────────────────────────────── */}
        {error && (
          <div role="alert" className="alert alert-danger py-2 mb-3">
            {error}
          </div>
        )}

        {/* ── Options list ──────────────────────────────────── */}
        {options.length === 0 ? (
          <p className="text-muted text-center mt-4">
            No options yet. Add some choices above!
          </p>
        ) : (
          <ul className="list-group mt-3">
            {options.map((opt, index) => (
              <li
                key={index}
                className="list-group-item d-flex align-items-center gap-2 py-2"
              >
                {editIndex === index ? (
                  /* ── Inline edit row ── */
                  <>
                    <input
                      type="text"
                      className={`form-control form-control-sm flex-grow-1${
                        error ? ' is-invalid' : ''
                      }`}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                      aria-label={`Edit ${opt}`}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-success"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  /* ── Read-only row ── */
                  <>
                    <span className="flex-grow-1">{opt}</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => startEdit(index)}
                      aria-label={`Edit ${opt}`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleRemove(index)}
                      aria-label={`Remove ${opt}`}
                    >
                      Remove
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* ── Option count badge ────────────────────────────── */}
        {options.length > 0 && (
          <p className="text-end text-muted mt-2 mb-0">
            <small>
              {options.length} option{options.length !== 1 ? 's' : ''} added
            </small>
          </p>
        )}
      </div>
    </div>
  );
};

export default OptionsManager;
