import { useState, useEffect } from 'react'; // Importer useEffect
import './App.css';

type Action = 'goal' | 'save' | 'miss';

function App() {
  const [history, setHistory] = useState<Action[]>([]);

  // --- NY EFFEKT TIL AT FORHINDRE TRÆK-NED OPFRISKNING ---
  useEffect(() => {
    let lastTouchY = 0; // Gemmer den lodrette position ved berøring

    // Funktion der stopper den indbyggede scrolling, hvis vi er i toppen
    const handleTouchMove = (e: TouchEvent) => {
      // Tjekker om trækket er opad (positive delta) eller nedad (negative delta)
      const touchY = e.touches[0].clientY;
      const deltaY = touchY - lastTouchY;
      lastTouchY = touchY;

      // Hvis vi er i toppen af siden (scrollY === 0) og trækker nedad (deltaY > 0),
      // forhindrer vi standard browser-handlingen (opfriskning).
      if (window.scrollY === 0 && deltaY > 0) {
        e.preventDefault();
      }
    };

    // Lyt efter berøringsbevægelser
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Renser op: fjerner lytteren, når komponenten afmonteres
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []); // [] betyder, at effekten kun kører én gang ved indlæsning

  // --- BEREGNINGER (Uændret) ---
  const goals = history.filter((a) => a === 'goal').length;
  const saves = history.filter((a) => a === 'save').length;
  const missed = history.filter((a) => a === 'miss').length;

  const shotsOnTarget = goals + saves;
  const totalAttempts = goals + saves + missed;

  const savePercentage = shotsOnTarget === 0
    ? 0
    : (saves / shotsOnTarget) * 100;

  const totalEfficiency = totalAttempts === 0
    ? 0
    : ((saves + missed) / totalAttempts) * 100;

  // --- FUNKTIONER (Uændret) ---

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
      {/* ... Resten af JSX'en er uændret ... */}
      <h1>Målmands Statistik 🤾</h1>

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
        <p>
          Redningsprocent: <strong>{savePercentage.toFixed(1)}%</strong>
        </p>
        <p>
          Total effektivitet: <strong>{totalEfficiency.toFixed(1)}%</strong>
        </p>
      </div>

      <button className="btn reset" onClick={handleReset}>
        Nulstil Kamp
      </button>
    </div>
  );
}

export default App;