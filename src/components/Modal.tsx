import { useState } from "react";
<<<<<<< HEAD
import type { League, Goalkeeper } from "../hooks/useMatchStats";

interface ModalProps {
  onClose: () => void;
  onStartMatch: (info: { league: League; homeTeam: string; awayTeam: string; goalkeepers: Goalkeeper[] }) => void;
=======
import type { League } from "../hooks/useMatchStats";

interface ModalProps {
  onClose: () => void;
  onStartMatch: (info: { league: League; homeTeam: string; awayTeam: string }) => void;
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
  onQuickReset: () => void;
}

export const Modal = ({ onClose, onStartMatch, onQuickReset }: ModalProps) => {
  const [league, setLeague] = useState<League>('');
<<<<<<< HEAD
  const [homeTeam, setHomeTeam] = useState('Roskilde Håndbold');
  const [awayTeam, setAwayTeam] = useState('');
  
  // Hent tidligere gemte målmænd fra localStorage, hvis de findes
  const savedGks: Goalkeeper[] = (() => {
    const stored = localStorage.getItem('hb_savedGks');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { /* ignore */ }
    }
    return [{ id: '1', name: 'August' }];
  })();

  // Filterér August fra, så vi kun viser de ekstra målmænd man kan vælge imellem
  const availableExtraGks = savedGks.filter(g => g.id !== '1' && g.name.toLowerCase() !== 'august');

  const [selectedExtraGkId, setSelectedExtraGkId] = useState<string>('');
  const [newExtraGkName, setNewExtraGkName] = useState<string>('');
=======
  const [homeTeam, setHomeTeam] = useState('Team Ramsø');
  const [awayTeam, setAwayTeam] = useState('');
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d

  const isFormValid = league !== '' && homeTeam.trim() !== '' && awayTeam.trim() !== '';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={onClose}>&times;</button>

        <h2>Ny Kamp</h2>

        <div className="form-section">
<<<<<<< HEAD
          <p>Vælg Hold / Række:</p>
          <div className="league-selector">
            <button
              className={`league-btn ${league === 'Roskilde Håndbold 3' ? 'active' : ''}`}
              onClick={() => setLeague('Roskilde Håndbold 3')}
            >Roskilde Håndbold 3</button>
            <button
              className={`league-btn ${league === 'Roskilde Håndbold 4' ? 'active' : ''}`}
              onClick={() => setLeague('Roskilde Håndbold 4')}
            >Roskilde Håndbold 4</button>
=======
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
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
          </div>
        </div>

        <div className="form-section">
          <input
            type="text"
<<<<<<< HEAD
            placeholder="Hjemmehold"
=======
            placeholder="Hjemmehold (f.eks. klubnavn)"
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
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

<<<<<<< HEAD
        {/* Målmands-sektion */}
        <div className="form-section gk-section">
          <p className="gk-section-title">Målmænd i truppen:</p>
          
          {/* August (Fastlåst med ID 1) */}
          <div className="gk-fixed-card">
            <span className="gk-fixed-name">🛡️ August (Fast Målmand)</span>
          </div>

          {/* Vælg tidligere målmand fra liste (hvis der er nogen) */}
          {availableExtraGks.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <select
                value={selectedExtraGkId}
                onChange={(e) => {
                  setSelectedExtraGkId(e.target.value);
                  setNewExtraGkName(''); // Nulstil felt til ny, hvis der vælges fra listen
                }}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff' }}
              >
                <option value="">-- Vælg tidligere ekstra målmand (valgfri) --</option>
                {availableExtraGks.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Eller skriv en ny målmand */}
          <input
            type="text"
            className="gk-input-extra"
            placeholder="Eller skriv ny ekstra målmand..."
            value={newExtraGkName}
            onChange={(e) => {
              setNewExtraGkName(e.target.value);
              setSelectedExtraGkId(''); // Nulstil dropdown, hvis der skrives i feltet
            }}
          />
        </div>

=======
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
        <button
          className="btn start-match-btn"
          disabled={!isFormValid}
          onClick={() => {
<<<<<<< HEAD
            const goalkeepers: Goalkeeper[] = [
              { id: '1', name: 'August' }
            ];

            // Tjek om der er valgt en fra dropdown-listen
            if (selectedExtraGkId) {
              const found = availableExtraGks.find(g => g.id === selectedExtraGkId);
              if (found) {
                goalkeepers.push(found);
              }
            } 
            // Eller om der er skrevet en ny (ID gives nu midlertidigt som 'temp', så tager useMatchStats over og giver den rigtige ID)
            else if (newExtraGkName.trim() !== '') {
              goalkeepers.push({
                id: '', 
                name: newExtraGkName.trim()
              });
            }

            onStartMatch({ league, homeTeam, awayTeam, goalkeepers });
=======
            onStartMatch({ league, homeTeam, awayTeam });
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
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