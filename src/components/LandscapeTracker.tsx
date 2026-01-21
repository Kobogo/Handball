import { useState } from 'react';
import type { Action } from '../hooks/useMatchStats';
import { MatchResults } from './MatchResults';
import './LandscapeTracker.css';

interface Props {
  stats: {
    saves: number;
    goals: number;
    missed: number;
    teamGoals: number;
  };
  homeTeam: string;
  awayTeam: string;
  onAction: (action: Action) => void;
  onUndo: (action: Action) => void;
  savePercentage: number;
  totalEfficiency: number;
}

export const LandscapeTracker = ({
  stats,
  homeTeam,
  awayTeam,
  onAction,
  onUndo,
  savePercentage,
  totalEfficiency
}: Props) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Hjælpefunktioner til navne logik
  const getHomeLabel = () => homeTeam || 'Os';
  const getAwayLabel = () => awayTeam || 'Modst.';

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
        <button className="switch-side-btn" onClick={() => setIsFlipped(!isFlipped)}>
          🔄 Byt Side
        </button>

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

        {/* ... resten af koden (stats-row og results-wrapper) er uændret ... */}
        <div className="landscape-stats-row">
          <div className="stat-item">
            <p>Redninger</p>
            <h2>{stats.saves || 0}</h2>
          </div>
          <div className="stat-item">
            <p>Forbi</p>
            <h2>{stats.missed || 0}</h2>
          </div>
        </div>

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