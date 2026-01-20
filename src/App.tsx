import { useState } from 'react';
import { usePreventRefresh } from './hooks/usePreventRefresh';
import { useMatchStats } from './hooks/useMatchStats';
import { StatsBoard } from './components/StatsBoard';
import { ActionButtons } from './components/ActionButtons';
import { MatchResults } from './components/MatchResults';
import { Modal } from './components/Modal';
import { Navbar } from './components/Navbar';
import HistoryPage from './components/HistoryPage';
import { useModal } from './hooks/useModal';
import './components/Modal.css';
import './components/Navbar.css';
import './App.css';

function App() {
  usePreventRefresh();
  const [currentView, setCurrentView] = useState<'tracker' | 'history'>('tracker');
  const { isOpen, open, close } = useModal();

  const {
    stats, matchInfo, isQuickReset, isLoading, savePercentage,
    totalEfficiency, handleAction, handleUndo, startNewMatch,
    quickReset, loadMatchForEdit, deleteMatch
  } = useMatchStats();

  const onEditFromHistory = (match: any) => {
    loadMatchForEdit(match);
    setCurrentView('tracker');
  };

  if (currentView === 'history') {
    return (
      <div className="container">
        <Navbar currentView="history" onNavigate={setCurrentView} onOpenModal={open} />
        <HistoryPage onEdit={onEditFromHistory} onDelete={deleteMatch} />
      </div>
    );
  }

  return (
    <div className="container">
      <Navbar currentView="tracker" onNavigate={setCurrentView} onOpenModal={open} />
      {isLoading && (
        <div className="loading-overlay"><div className="spinner"></div><p>Arbejder...</p></div>
      )}
      {isQuickReset && <div className="warning-banner">⚠️ Hurtig tæller: Gemmer IKKE</div>}

      <header>
        <div className="match-header">
          <span className="league-badge">{matchInfo?.league || 'Klar'}</span>
          <h1>{matchInfo ? `${matchInfo.homeTeam} vs ${matchInfo.awayTeam}` : 'Målmands Statistik'}</h1>
        </div>
      </header>

      <main>
        <StatsBoard {...stats} />
        <ActionButtons onAction={handleAction} onUndo={handleUndo} counts={stats} />
        <hr />
        <MatchResults savePercentage={savePercentage} totalEfficiency={totalEfficiency} />
        {isOpen && <Modal onClose={close} onStartMatch={startNewMatch} onQuickReset={quickReset} />}
      </main>
    </div>
  );
}

export default App;