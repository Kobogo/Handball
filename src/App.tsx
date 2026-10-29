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

  const hasMultipleGoalkeepers = Boolean(matchInfo?.goalkeepers && matchInfo.goalkeepers.length > 1);

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
          {/* 1. TOPPEN: Vis kun knapper til at skifte imellem målmænd, hvis der er flere end 1 */}
          {hasMultipleGoalkeepers && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', justifyContent: 'center' }}>
              {matchInfo!.goalkeepers.map(gk => {
                const isSelected = activeGoalkeeperId === gk.id;
                return (
                  <button
                    key={gk.id}
                    onClick={() => setActiveGoalkeeperId(gk.id)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #2196F3' : '1px solid #ccc',
                      background: isSelected ? '#e3f2fd' : '#fff',
                      color: isSelected ? '#0d47a1' : '#333',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                  >
                    🛡️ {gk.name} {isSelected ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          )}

          {/* Aktive tællere for hvem der står på banen lige nu */}
          <StatsBoard 
            saves={activeStats.saves} 
            goals={activeStats.goals} 
            missed={activeStats.missed} 
            teamGoals={activeStats.teamGoals} 
          />
          <ActionButtons onAction={handleAction} onUndo={handleUndo} counts={activeStats} />
          
          <hr />

          {/* 2. BUNDEN: Vis kun samlet oversigt over målmænd, hvis der er flere end 1 */}
          {hasMultipleGoalkeepers && (
            <div style={{ background: '#fff', padding: '12px', borderRadius: '12px', boxShadow: 'var(--card-shadow)', marginTop: '10px' }}>
              <h3 style={{ fontSize: '0.9rem', margin: '0 0 8px 0', color: 'var(--text-muted)' }}>Målmænd Status (Hele Kampen)</h3>
              
              {matchInfo!.goalkeepers.map(gk => {
                const gkSt = getStatsForGk(gk.id);
                const isSelected = activeGoalkeeperId === gk.id;
                return (
                  <div 
                    key={gk.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid #f0f0f0',
                      fontSize: '0.85rem'
                    }}
                  >
                    <span style={{ fontWeight: isSelected ? 'bold' : 'normal', color: isSelected ? '#2196F3' : '#333' }}>
                      {gk.name} {isSelected ? '(Aktiv)' : ''}
                    </span>
                    <span>
                      Redninger: <strong>{gkSt.saves}</strong> | Mål imod: <strong>{gkSt.goals}</strong> | %: <strong>{gkSt.savePercentage.toFixed(1)}%</strong>
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* De almindelige procenter for den aktive målmand */}
          <MatchResults 
            savePercentage={activeStats.savePercentage} 
            totalEfficiency={activeStats.totalEfficiency} 
          />
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