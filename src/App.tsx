import { useState, useEffect } from 'react';
import { usePreventRefresh } from './hooks/usePreventRefresh';
import { useMatchStats } from './hooks/useMatchStats';
import { StatsBoard } from './components/StatsBoard';
import { ActionButtons } from './components/ActionButtons';
import { MatchResults } from './components/MatchResults';
import { Modal } from './components/Modal';
import { Navbar } from './components/Navbar';
import HistoryPage from './components/HistoryPage';
import { useModal } from './hooks/useModal';
import { LandscapeTracker } from './components/LandscapeTracker';

// CSS Imports
import './components/Navbar.css';
import './components/Modal.css';
import './components/StatsBoard.css';
import './components/ActionButtons.css';
import './components/MatchResults.css';
import './App.css';

function App() {
  usePreventRefresh();
  const [currentView, setCurrentView] = useState<'tracker' | 'history'>('tracker');
  const { isOpen, open, close } = useModal();

  const {
    stats,
    matchInfo,
    isQuickReset,
    isLoading,
    savePercentage,
    totalEfficiency,
    handleAction,
    handleUndo,
    startNewMatch,
    quickReset,
    loadMatchForEdit,
    deleteMatch
  } = useMatchStats();

  useEffect(() => {
    if (!matchInfo && !isQuickReset) {
      open();
    }
  }, [matchInfo, isQuickReset, open]);

  const onEditFromHistory = (match: any) => {
    loadMatchForEdit(match);
    setCurrentView('tracker');
  };

  // Render History View
  if (currentView === 'history') {
    return (
      <div className="container">
        <Navbar currentView="history" onNavigate={setCurrentView} onOpenModal={open} />
        <HistoryPage onEdit={onEditFromHistory} onDelete={deleteMatch} />
      </div>
    );
  }

  // Render Tracker View (Portrait + Landscape)
  return (
    <div className="container">
      {/* 1. NAVIGATION (Altid synlig) */}
      <Navbar currentView="tracker" onNavigate={setCurrentView} onOpenModal={open} />

      {/* 2. LANDSCAPE OVERLAY (Vises kun via CSS media query) */}
      <LandscapeTracker
        stats={stats}
        homeTeam={matchInfo?.homeTeam || 'Os'}
        awayTeam={matchInfo?.awayTeam || 'Modst.'}
        onAction={handleAction}
        onUndo={handleUndo}
        savePercentage={savePercentage}
        totalEfficiency={totalEfficiency}
      />

      {/* 3. PORTRAIT CONTENT (Indpakket så det kan skjules samlet) */}
      <div className="portrait-content">
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Arbejder...</p>
          </div>
        )}

        {isQuickReset && (
          <div className="warning-banner">⚠️ Hurtig tæller: Gemmer IKKE</div>
        )}

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
        </main>
      </div>

      {/* MODAL (Udenfor portrait-content så den altid kan ses) */}
      {isOpen && (
        <Modal
          onClose={close}
          onStartMatch={(info) => { startNewMatch(info); close(); }}
          onQuickReset={() => { quickReset(); close(); }}
        />
      )}
    </div>
  );
}

export default App;