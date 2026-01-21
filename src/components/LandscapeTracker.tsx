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
  onAction: (action: Action) => void;
  onUndo: (action: Action) => void;
  savePercentage: number;
  totalEfficiency: number;
}

export const LandscapeTracker = ({ stats, onAction, onUndo, savePercentage, totalEfficiency }: Props) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const renderControl = (type: Action, label: string, className: string) => (
    <div className="controls-grid">
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
        <h3>{isFlipped ? 'Modstander' : 'Vores Mål'}</h3>
        <div className="btn-group">
          {isFlipped ? (
            renderControl('team_goal', 'Mål scoret!', 'team_goal')
          ) : (
            <>
              {renderControl('save', 'Redning', 'save')}
              {renderControl('goal', 'Mål imod', 'goal')}
              {renderControl('miss', 'Forbi', 'miss')}
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
            <span className="score-label">{isFlipped ? 'Modst.' : 'Os'}</span>
            <span className="score-number">
              {isFlipped ? (stats.goals || 0) : (stats.teamGoals || 0)}
            </span>
          </div>

          <div className="score-separator">-</div>

          <div className="score-box">
            <span className="score-label">{isFlipped ? 'Os' : 'Modst.'}</span>
            <span className="score-number">
              {isFlipped ? (stats.teamGoals || 0) : (stats.goals || 0)}
            </span>
          </div>
        </div>

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
        <h3>{isFlipped ? 'Vores Mål' : 'Modstander'}</h3>
        <div className="btn-group">
          {!isFlipped ? (
            renderControl('team_goal', 'Mål scoret!', 'team_goal')
          ) : (
            <>
              {renderControl('save', 'Redning', 'save')}
              {renderControl('goal', 'Mål imod', 'goal')}
              {renderControl('miss', 'Forbi', 'miss')}
            </>
          )}
        </div>
      </div>
    </div>
  );
};