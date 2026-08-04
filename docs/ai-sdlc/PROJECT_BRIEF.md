# Project Brief

## What & why

React Mini Projects is a curated collection of small, standalone React applications designed for learning and skill-building. It serves both beginners seeking hands-on practice and experienced developers looking to contribute. The repository solves the problem of fragmented React examples by grouping focused, self-contained projects in one discoverable location.

## Key features

- **Six existing mini projects**: EMI Calculator, BMI Calculator, Filtering Card, Random Color Generator, GitHub User Search, Text Editor
- **Community-driven contributions**: structured issue tracking and PR workflow for adding new projects
- **Self-contained modules**: each project lives in its own `src/` subdirectory with independent functionality
- **Bootstrap styling**: consistent UI framework across projects
- **Rich text editing support**: react-quill integration (used by Text Editor)
- **User notifications**: react-toastify for feedback
- **Comprehensive testing setup**: testing-library stack (React, Jest DOM, user-event)

## Tech stack

- **Framework**: React + React DOM
- **Build & development**: react-scripts (Create React App)
- **UI/styling**: Bootstrap
- **Components & utilities**: react-quill, react-toastify
- **Testing**: @testing-library/{react,jest-dom,user-event}, web-vitals
- **Node.js-based**: standard npm scripts (dev, start, build, test)

## Architecture at a glance

```
src/
  ├── EMICalculator/
  ├── BMICalcalator/
  ├── Filter/
  ├── RandomColorGenerator/
  ├── GitHubUserSearch/
  └── TextEditor/
public/
  └── [static assets]
```

Each project is a standalone module with its own logic and UI; likely a main App or router component orchestrates navigation between them. No shared backend or complex orchestration—emphasis is on simplicity and discoverability.

## Conventions

- **Development**: `npm run dev` (local development server)
- **Production**: `npm run build` → output to build/
- **Testing**: `npm test` (Jest via react-scripts)
- **Code style**: inherits Create React App defaults (Prettier, ESLint via react-scripts)
- **Branching**: feature branches following `feature/new-project` pattern for contributions
- **Project structure**: each new mini project should include a README explaining its purpose and functionality

## Pointers

- **[README.md](README.md)** — contribution guidelines, list of existing projects, and setup instructions
- **Individual project READMEs** — detailed documentation for each mini project under `src/<ProjectName>/`
- **[GitHub Issues](https://github.com/PranabKumarSahoo/react-mini-projects/issues)** — task tracking and ideas for new projects
- **[LICENSE](LICENSE)** — MIT license terms
- **package.json** — dependency manifest and npm scripts