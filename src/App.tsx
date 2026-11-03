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
    activeGoalkeeperId,
    setActiveGoalkeeperId,
    getStatsForGk,
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

  // Aktiv målmand stats (til tællere og knapper)
  const activeGkObj = matchInfo?.goalkeepers?.find(g => g.id === activeGoalkeeperId);
  const activeStats = activeGoalkeeperId 
    ? getStatsForGk(activeGoalkeeperId) 
    : { ...stats, savePercentage, totalEfficiency };

  const hasMultipleGoalkeepers = Boolean(matchInfo?.goalkeepers && matchInfo.goalkeepers.length > 0);

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

      {/* LANDSCAPE OVERLAY */}
      <LandscapeTracker
        stats={stats}
        activeGkStats={activeStats}
        activeGkName={activeGkObj?.name || 'Målmand'}
        goalkeepers={matchInfo?.goalkeepers || []}
        activeGoalkeeperId={activeGoalkeeperId}
        onSelectGk={setActiveGoalkeeperId}
        getStatsForGk={getStatsForGk}
        homeTeam={matchInfo?.homeTeam || 'Roskilde Håndbold'}
        awayTeam={matchInfo?.awayTeam || 'Modst.'}
        onAction={handleAction}
        onUndo={handleUndo}
        savePercentage={activeStats.savePercentage}
        totalEfficiency={activeStats.totalEfficiency}
      />

      {/* PORTRAIT CONTENT */}
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
          {/* Aktive tællere: Bruger activeStats.saves og missed til den aktive, men stats.goals (samlede mål imod) */}
          <StatsBoard 
            saves={activeStats.saves} 
            goals={stats.goals} 
            missed={activeStats.missed} 
            teamGoals={stats.teamGoals} 
          />
          <ActionButtons onAction={handleAction} onUndo={handleUndo} counts={activeStats} />
          
          <hr />

          {/* MÅLMÆND STATUS */}
          {hasMultipleGoalkeepers && (
            <div className="gk-status-container">
              <h3 className="gk-section-title">Målmænd Status</h3>
              <div className="gk-boxes-stack">
                {matchInfo!.goalkeepers.map(gk => {
                  const gkSt = getStatsForGk(gk.id);
                  const isSelected = activeGoalkeeperId === gk.id;
                  return (
                    <div 
                      key={gk.id}
                      onClick={() => setActiveGoalkeeperId(gk.id)}
                      className={`gk-card-box ${isSelected ? 'active' : ''}`}
                    >
                      <div className="gk-card-name">
                        {isSelected ? '🛡️' : ''} {gk.name} {isSelected && '✓ (Aktiv)'}
                      </div>
                      <div className="gk-card-stats">
                        <span>Redninger: <strong>{gkSt.saves}</strong></span>
                        <span>Mål imod: <strong>{gkSt.goals}</strong></span>
                        <span>Forbi: <strong>{gkSt.missed}</strong></span>
                        <span>%: <strong>{gkSt.savePercentage.toFixed(0)}%</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

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