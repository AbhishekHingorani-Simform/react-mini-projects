# Decision Wheel

A React mini-project that helps you make decisions by spinning a wheel of custom choices.

## Features

### Options Manager (current)
- **Add** custom choices via text input (click _Add_ or press **Enter**)
- **Edit** any option in-place with inline Save / Cancel controls
- **Remove** individual options with a dedicated button
- **Validation** — rejects:
  - Empty or whitespace-only entries
  - Duplicate entries (case-insensitive comparison)
- **Inline error feedback** displayed as an alert below the input
- Option count badge keeps track of how many choices are in the list

### Spin Wheel (planned)
- Animated SVG/Canvas wheel populated from the options list
- Click-to-spin with a deceleration animation
- Highlighted winner panel after each spin

## Usage

The component is registered in the main `App.js` sidebar under **Decision Wheel** and renders automatically when that tab is active.

To use `OptionsManager` standalone in another context:

```jsx
import OptionsManager from './DecisionWheel/OptionsManager';

function MyPage() {
  return <OptionsManager />;
}
```

`OptionsInput` is kept as a backward-compatible re-export of `OptionsManager`:

```jsx
import OptionsInput from './DecisionWheel/OptionsInput'; // same component
```

## Project structure

```
src/DecisionWheel/
├── DecisionWheel.js       # Module entry point — composes sub-components
├── OptionsManager.jsx     # Options manager UI (add / edit / remove / validate) ← canonical
├── OptionsManager.test.js # Jest + React Testing Library test suite
├── OptionsInput.js        # Re-export alias for backward compatibility
├── OptionsInput.test.js   # Additional test suite (imports via OptionsInput alias)
└── README.md              # This file
```

## Running the tests

```bash
# Run only the OptionsManager test suite (no watch mode)
npm test -- --watchAll=false OptionsManager

# Run only the OptionsInput test suite
npm test -- --watchAll=false OptionsInput

# Run all DecisionWheel tests
npm test -- --watchAll=false DecisionWheel

# Run in watch mode during development
npm test -- --watch OptionsManager
```

## Tech stack

| Concern    | Library                                                     |
|------------|-------------------------------------------------------------|
| UI         | React 18 + Bootstrap 5                                      |
| Testing    | Jest, @testing-library/react, @testing-library/jest-dom     |

## Contributing

1. Fork the repo and create a `feature/decision-wheel-*` branch.
2. Follow the existing Bootstrap class conventions for styling.
3. Add or update tests in `OptionsManager.test.js` for any behaviour change.
4. Ensure `npm test -- --watchAll=false OptionsManager` passes before opening a PR.
