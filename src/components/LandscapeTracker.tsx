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

  const activeStats = activeGoalkeeperId 
    ? getStatsForGk(activeGoalkeeperId) 
    : { ...stats, savePercentage, totalEfficiency };

  const hasMultipleGoalkeepers = goalkeepers.length > 0;

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

        <div className="landscape-score-display">
          <div className="score-box">
            <span className="score-label">{isFlipped ? getAwayLabel() : getHomeLabel()}</span>
            <span className="score-number">
              {isFlipped ? (stats.goals || 0) : (stats.teamGoals || 0)}
            </span>
          </div>

          <div className="score-separator">-</div>

          <div className="score-box">
            <span className="score-label">{isFlipped ? getHomeLabel() : getAwayLabel()}</span>
            <span className="score-number">
              {isFlipped ? (stats.teamGoals || 0) : (stats.goals || 0)}
            </span>
          </div>
        </div>

        <StatsBoard 
          saves={activeStats.saves} 
          goals={activeStats.goals} 
          missed={activeStats.missed} 
          teamGoals={stats.teamGoals} 
        />

        {/* HVER MÅLMAND I STAKKET BOKS MED STØRRE TEKST OG SKUD FORBI */}
        {hasMultipleGoalkeepers && (
          <div className="gk-status-container-landscape">
            <p className="gk-section-title-landscape">Målmænd Status</p>
            <div className="gk-boxes-stack-landscape">
              {goalkeepers.map(gk => {
                const gkSt = getStatsForGk(gk.id);
                const isSelected = activeGoalkeeperId === gk.id;
                return (
                  <div 
                    key={gk.id}
                    onClick={() => onSelectGk(gk.id)}
                    className={`gk-card-box-landscape ${isSelected ? 'active' : ''}`}
                  >
                    <div className="gk-card-name-landscape">
                      {isSelected ? '🛡️' : ''} {gk.name} {isSelected && '✓'}
                    </div>
                    <div className="gk-card-stats-landscape">
                      <span>Redn: <strong>{gkSt.saves}</strong></span>
                      <span>Mål: <strong>{gkSt.goals}</strong></span>
                      <span>Forbi: <strong>{gkSt.missed}</strong></span>
                      <span>%: <strong>{gkSt.savePercentage.toFixed(0)}%</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="results-wrapper">
          {/* <MatchResults savePercentage={savePercentage} totalEfficiency={totalEfficiency} /> */}
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