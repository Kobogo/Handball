import { useState } from 'react';
import './App.css';

type Action = 'goal' | 'save' | 'miss';

function App() {
  const [history, setHistory] = useState<Action[]>([]);

  // --- BEREGNINGER ---
  const goals = history.filter((a) => a === 'goal').length;
  const saves = history.filter((a) => a === 'save').length;
  const missed = history.filter((a) => a === 'miss').length;

  const shotsOnTarget = goals + saves;
  const totalAttempts = goals + saves + missed;

  // ÆNDRING 1: Fjerner Math.round() for at få det rå decimaltal
  const savePercentage = shotsOnTarget === 0
    ? 0
    : (saves / shotsOnTarget) * 100;

  // ÆNDRING 2: Fjerner Math.round() for at få det rå decimaltal
  const totalEfficiency = totalAttempts === 0
    ? 0
    : ((saves + missed) / totalAttempts) * 100;

  // --- FUNKTIONER (uændret) ---

  const handleAction = (action: Action) => {
    setHistory([...history, action]);
  };

  const handleUndoSpecific = (actionToRemove: Action) => {
    const newHistory = [...history];
    const indexToRemove = newHistory.lastIndexOf(actionToRemove);

    if (indexToRemove !== -1) {
      newHistory.splice(indexToRemove, 1);
      setHistory(newHistory);
    }
  };

  const handleReset = () => {
    setHistory([]);
  };

  return (
    <div className="container">
      <h1>Målmands Statistik 🤾</h1>

      {/* ... resten af koden (statistik tavlen og knapper) er uændret ... */}
      <div className="stats-board">
        <div className="stat-item">
          <h2>{saves}</h2>
          <p>Redninger</p>
        </div>
        <div className="stat-item">
          <h2>{goals}</h2>
          <p>Mål scoret</p>
        </div>
        <div className="stat-item">
          <h2>{missed}</h2>
          <p>Skud forbi</p>
        </div>
      </div>

      <div className="controls-grid">
        <button className="btn save big-btn" onClick={() => handleAction('save')}>Redning</button>
        <button className="btn undo-small" onClick={() => handleUndoSpecific('save')} disabled={saves === 0} title="Fortryd sidste redning">↶</button>

        <button className="btn goal big-btn" onClick={() => handleAction('goal')}>Mål Scoret</button>
        <button className="btn undo-small" onClick={() => handleUndoSpecific('goal')} disabled={goals === 0} title="Fortryd sidste mål">↶</button>

        <button className="btn miss big-btn" onClick={() => handleAction('miss')}>Skud Forbi</button>
        <button className="btn undo-small" onClick={() => handleUndoSpecific('miss')} disabled={missed === 0} title="Fortryd sidste forbi">↶</button>
      </div>

      <hr />

      <div className="results">
        <h3>Statistik</h3>
        {/* ÆNDRING 3: Bruger .toFixed(1) til at vise præcis ét decimal */}
        <p>
          Redningsprocent: <strong>{savePercentage.toFixed(1)}%</strong>
        </p>
        {/* ÆNDRING 4: Bruger .toFixed(1) til at vise præcis ét decimal */}
        <p>
          Total effektivitet: <strong>{totalEfficiency.toFixed(1)}%</strong>
        </p>
        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Antal aktioner i alt: {totalAttempts}
        </p>
      </div>

      <button className="btn reset" onClick={handleReset}>
        Nulstil Kamp
      </button>
    </div>
  );
}

export default App;