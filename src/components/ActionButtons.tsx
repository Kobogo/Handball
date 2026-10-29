import type { Action } from "../hooks/useMatchStats";

interface ActionButtonsProps {
  onAction: (action: Action) => void;
  onUndo: (action: Action) => void;
  counts: { saves: number; goals: number; missed: number; teamGoals: number };
}

export const ActionButtons = ({ onAction, onUndo, counts }: ActionButtonsProps) => (
  <div className="controls-grid">
    {/* Redning */}
    <button className="btn save big-btn" onClick={() => onAction('save')}>Redning</button>
    <button className="btn undo-small" onClick={() => onUndo('save')} disabled={counts.saves === 0}>↶</button>

    {/* Mål */}
    <button className="btn goal big-btn" onClick={() => onAction('goal')}>Mål Scoret</button>
    <button className="btn undo-small" onClick={() => onUndo('goal')} disabled={counts.goals === 0}>↶</button>

    {/* Miss */}
    <button className="btn miss big-btn" onClick={() => onAction('miss')}>Skud Forbi</button>
    <button className="btn undo-small" onClick={() => onUndo('miss')} disabled={counts.missed === 0}>↶</button>

    {/* Team Goal */}
    <button className="btn team_goal big-btn" onClick={() => onAction('team_goal')}>Vores Mål</button>
    <button className="btn undo-small" onClick={() => onUndo('team_goal')} disabled={counts.teamGoals === 0}>↶</button>
  </div>
);