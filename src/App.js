import { useState } from 'react';
import './App.css';
import BMICalculator from './BMICalcalator/BMICalculator';
import EMICalculator from './EMICalculator/EMICalculator';
import FilterCard from './Filter/FilterCard';
import GithubSearch from './GitHubUserSearch/GitHubSearch';
import ColorGenerator from './RandomColorGenerator/ColorGenerator';
import TextEditor from './TextEditor/TextEditor';
import Motivator from './Motivator/Motivator';

const TABS = [
  { key: 'emi', label: 'EMI Calculator', Component: EMICalculator },
  { key: 'bmi', label: 'BMI Calculator', Component: BMICalculator },
  { key: 'filter', label: 'Filter Card', Component: FilterCard },
  { key: 'github', label: 'GitHub Search', Component: GithubSearch },
  { key: 'color', label: 'Color Generator', Component: ColorGenerator },
  { key: 'editor', label: 'Text Editor', Component: TextEditor },
  { key: 'motivator', label: 'Motivator', Component: Motivator },
];

function App() {
  const [active, setActive] = useState(TABS[0].key);
  const ActiveComponent = TABS.find((tab) => tab.key === active).Component;

  return (
    <div className="app-layout">
      <aside className="app-sidebar bg-dark text-white">
        <h1 className="h5 px-3 py-4 mb-0 border-bottom border-secondary">
          React Mini Projects
        </h1>
        <ul className="nav nav-pills flex-column p-3 gap-2">
          {TABS.map((tab) => (
            <li className="nav-item" key={tab.key}>
              <button
                type="button"
                className={`nav-link text-start w-100 ${
                  active === tab.key ? 'active' : 'text-white'
                }`}
                onClick={() => setActive(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="project-stage">
        <ActiveComponent key={active} />
      </main>
    </div>
  );
}

export default App;
