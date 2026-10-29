import { useState } from 'react';
import type { Action, Goalkeeper } from '../hooks/useMatchStats';
import { MatchResults } from './MatchResults';
import { StatsBoard } from './StatsBoard';
import './LandscapeTracker.css';

interface Props {
  stats: {
    saves: number;
    goals: number;
    missed: number;
    teamGoals: number;
  };
  activeGkStats: {
    saves: number;
    goals: number;
    missed: number;
    savePercentage: number;
  };
  activeGkName: string;
  goalkeepers: Goalkeeper[];
  activeGoalkeeperId: string;
  onSelectGk: (id: string) => void;
  getStatsForGk: (id: string) => { goals: number; saves: number; missed: number; savePercentage: number; teamGoals?: number };
  homeTeam: string;
  awayTeam: string;
  onAction: (action: Action) => void;
  onUndo: (action: Action) => void;
  savePercentage: number;
  totalEfficiency: number;
}

export const LandscapeTracker = ({
  stats,
  activeGkStats,
  goalkeepers,
  activeGoalkeeperId,
  onSelectGk,
  getStatsForGk,
  homeTeam,
  awayTeam,
  onAction,
  onUndo,
  savePercentage,
  totalEfficiency
}: Props) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const getHomeLabel = () => homeTeam || 'Roskilde Håndbold';
  const getAwayLabel = () => awayTeam || 'Modst.';

  // Hent statistik for den aktive målmand (fallback til generelle stats hvis ingen er valgt)
  const activeStats = activeGoalkeeperId 
    ? getStatsForGk(activeGoalkeeperId) 
    : { ...stats, savePercentage, totalEfficiency };

  const hasMultipleGoalkeepers = goalkeepers.length > 1;

  const renderControl = (type: Action, label: string, className: string, side: 'left' | 'right') => (
    <div className={`controls-grid ${side}-side-controls`}>
      <button className={`btn big-btn ${className}`} onClick={() => onAction(type)}>
        {label}
      </button>
      <button className="btn undo-small" onClick={() => onUndo(type)}>
        ↶
      </button>
    </div>
  );

  return (
    <div className={`landscape-layout ${isFlipped ? 'flipped' : ''}`}>

      {/* VENSTRE SIDE */}
      <div className="side-panel">
        <h3>{isFlipped ? getAwayLabel() : getHomeLabel()}</h3>
        <div className="btn-group">
          {isFlipped ? (
            renderControl('team_goal', 'Mål scoret!', 'team_goal', 'left')
          ) : (
            <>
              {renderControl('save', 'Redning', 'save', 'left')}
              {renderControl('goal', 'Mål imod', 'goal', 'left')}
              {renderControl('miss', 'Forbi', 'miss', 'left')}
            </>
          )}
        </div>
      </div>

      {/* MIDTEN */}
      <div className="center-panel">
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
          <button className="switch-side-btn" onClick={() => setIsFlipped(!isFlipped)}>
            🔄 Byt Side
          </button>
        </div>

        {/* Målmands-vælger knapper i toppen af midterpanelet i landscape (vises kun hvis der er flere målmænd) */}
        {hasMultipleGoalkeepers && (
          <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
            {goalkeepers.map(gk => {
              const isSelected = activeGoalkeeperId === gk.id;
              return (
                <button
                  key={gk.id}
                  onClick={() => onSelectGk(gk.id)}
                  style={{
                    flex: 1,
                    padding: '4px 6px',
                    borderRadius: '6px',
                    border: isSelected ? '1px solid #2196F3' : '1px solid #ddd',
                    background: isSelected ? '#e3f2fd' : '#fff',
                    color: isSelected ? '#0d47a1' : '#333',
                    fontWeight: 'bold',
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                >
                  🛡️ {gk.name} {isSelected ? '✓' : ''}
                </button>
              );
            })}
          </div>
        )}

        <div className="landscape-score-display">
          <div className="score-box">
            <span className="score-label">{isFlipped ? getAwayLabel() : getHomeLabel()}</span>
            <span className="score-number">
              {isFlipped ? (activeGkStats.goals || 0) : (stats.teamGoals || 0)}
            </span>
          </div>

          <div className="score-separator">-</div>

          <div className="score-box">
            <span className="score-label">{isFlipped ? getHomeLabel() : getAwayLabel()}</span>
            <span className="score-number">
              {isFlipped ? (stats.teamGoals || 0) : (activeGkStats.goals || 0)}
            </span>
          </div>
        </div>

        <StatsBoard 
          saves={activeStats.saves} 
          goals={activeStats.goals} 
          missed={activeStats.missed} 
          teamGoals={stats.teamGoals} 
        />

        {/* BEGGE MÅLMÆND STATS OVER HINANDEN NEDE I BUNDEN (vises kun hvis der er flere målmænd) */}
        {hasMultipleGoalkeepers && (
          <div style={{ background: '#fff', padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', textAlign: 'center' }}>
              Målmænd Status (Hele Kampen)
            </p>
            {goalkeepers.map(gk => {
              const gkSt = getStatsForGk(gk.id);
              const isSelected = activeGoalkeeperId === gk.id;
              return (
                <div 
                  key={gk.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '2px 0',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: '0.7rem'
                  }}
                >
                  <span style={{ fontWeight: isSelected ? 'bold' : 'normal', color: isSelected ? '#2196F3' : '#333' }}>
                    {gk.name} {isSelected ? '(Aktiv)' : ''}
                  </span>
                  <span>
                    Redn: <strong>{gkSt.saves}</strong> | Mål: <strong>{gkSt.goals}</strong> | %: <strong>{gkSt.savePercentage.toFixed(0)}%</strong>
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="results-wrapper">
          <MatchResults savePercentage={savePercentage} totalEfficiency={totalEfficiency} />
        </div>
      </div>

      {/* HØJRE SIDE */}
      <div className="side-panel">
        <h3>{isFlipped ? getHomeLabel() : getAwayLabel()}</h3>
        <div className="btn-group">
          {!isFlipped ? (
            renderControl('team_goal', 'Mål scoret!', 'team_goal', 'right')
          ) : (
            <>
              {renderControl('save', 'Redning', 'save', 'right')}
              {renderControl('goal', 'Mål imod', 'goal', 'right')}
              {renderControl('miss', 'Forbi', 'miss', 'right')}
            </>
          )}
        </div>
      </div>
    </div>
  );
};