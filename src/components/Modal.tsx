import { useState } from "react";
import type { League } from "../hooks/useMatchStats";

interface ModalProps {
  onClose: () => void;
  onStartMatch: (info: { league: League; homeTeam: string; awayTeam: string }) => void;
  onQuickReset: () => void;
}

export const Modal = ({ onClose, onStartMatch, onQuickReset }: ModalProps) => {
  const [league, setLeague] = useState<League>('');
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');

  const isFormValid = league !== '' && homeTeam.trim() !== '' && awayTeam.trim() !== '';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={onClose}>&times;</button>

        <h2>Ny Kamp</h2>

        <div className="form-section">
          <p>Vælg Liga:</p>
          <div className="league-selector">
            <button
              className={`league-btn ${league === 'U11' ? 'active' : ''}`}
              onClick={() => setLeague('U11')}
            >U11</button>
            <button
              className={`league-btn ${league === 'U13' ? 'active' : ''}`}
              onClick={() => setLeague('U13')}
            >U13</button>
          </div>
        </div>

        <div className="form-section">
          <input
            type="text"
            placeholder="Hjemmehold (f.eks. klubnavn)"
            value={homeTeam}
            onChange={(e) => setHomeTeam(e.target.value)}
          />
          <input
            type="text"
            placeholder="Udehold (Modstander)"
            value={awayTeam}
            onChange={(e) => setAwayTeam(e.target.value)}
          />
        </div>

        <button
          className="btn start-match-btn"
          disabled={!isFormValid}
          onClick={() => {
            onStartMatch({ league, homeTeam, awayTeam });
            onClose();
          }}
        >
          Start Officiel Kamp
        </button>

        <div className="quick-reset-area">
          <hr />
          <button className="btn-link" onClick={() => { onQuickReset(); onClose(); }}>
            Ryd kun tællere (Hurtig nulstilling)
          </button>
          <p className="quick-reset-info">
            Bruges til uformel træning. Data logges ikke i databasen.
          </p>
        </div>
      </div>
    </div>
  );
};