# CLAUDE.md

## Project Overview

A collection of small, standalone React projects designed for learning and contribution. Includes calculators (EMI, BMI), text tools, and APIs (GitHub user search, color generators).

## Architecture

```
src/
  ├── EMICalculator/          # Loan EMI calculator
  ├── BMICalcalator/          # Body mass index calculator
  ├── Filter/                 # Card filtering component
  ├── RandomColorGenerator/   # Color generation tool
  ├── GitHubUserSearch/       # GitHub API integration
  └── TextEditor/             # Rich text editor (uses react-quill)
public/                       # Static assets
```

Each project is self-contained with its own components and styling.

## Tech Stack

- **React** – UI framework
- **Create React App** – Build tooling (react-scripts)
- **Bootstrap** – CSS framework
- **react-quill** – Rich text editor library
- **react-toastify** – Toast notifications
- **@testing-library** – Component testing (React, Jest-DOM, user-event)

## Commands

```bash
npm start   # Start development server
npm run dev # Development mode (if different from start)
npm run build # Build for production
npm test    # Run test suite
npm run eject # Eject from Create React App (irreversible)
```

## Code Style & Conventions

- Each mini project lives in its own `src/` subdirectory.
- Include a README.md in each project directory explaining its purpose and usage.
- Use React functional components with hooks.
- Follow the existing project structure when adding new projects.

## Key Files

- **README.md** – Contribution guidelines, existing projects list, and adding-new-projects instructions
- **package.json** – Dependencies and build/test scripts
