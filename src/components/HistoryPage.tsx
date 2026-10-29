import { useEffect, useState } from 'react';
import './HistoryPage.css';

<<<<<<< HEAD
interface GoalkeeperStats {
  gk_id: string;
  gk_name: string;
  saves: number;
  goals_against: number;
  missed: number;
}

=======
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
interface MatchHistory {
  id: number;
  league: string;
  home_team: string;
  away_team: string;
  created_at: string;
  saves: string;
  goals_against: string;
  missed: string;
  team_goals: string;
<<<<<<< HEAD
  goalkeepers?: GoalkeeperStats[];
=======
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
}

interface HistoryPageProps {
  onEdit: (match: MatchHistory) => void;
  onDelete: (id: number) => Promise<boolean>;
}

const HistoryPage = ({ onEdit, onDelete }: HistoryPageProps) => {
  const [matches, setMatches] = useState<MatchHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = () => {
    setLoading(true);
    fetch('https://handball-backend-xwvh.onrender.com/api/matches')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
<<<<<<< HEAD
=======
          // Vi sorterer dem eksplicit her efter ID (højeste ID er nyeste)
          // Dette sikrer at nyeste altid er øverst uanset backend rækkefølge
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
          const sorted = [...data].sort((a, b) => b.id - a.id);
          setMatches(sorted);
        } else {
          setMatches([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fejl:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const calculateAverages = () => {
    if (matches.length === 0) return { avgSaves: 0, avgPct: 0 };
    const totalSaves = matches.reduce((acc, m) => acc + Number(m.saves), 0);
    const totalGoalsAgainst = matches.reduce((acc, m) => acc + Number(m.goals_against), 0);
    const avgSaves = totalSaves / matches.length;
    const avgPct = (totalSaves / (totalSaves + totalGoalsAgainst)) * 100 || 0;
    return { avgSaves, avgPct };
  };

  const { avgSaves, avgPct } = calculateAverages();

  const handleDelete = async (id: number) => {
    const success = await onDelete(id);
    if (success) {
      fetchMatches();
    }
  };

  return (
    <div className="history-container">
      <main className="history-content">
        <h2 className="history-title">Kamphistorik</h2>

        {!loading && matches.length > 0 && (
          <div className="history-summary">
            <div className="summary-item">
              <span className="summary-label">Antal kampe</span>
              <span className="summary-value">{matches.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Gns. redninger</span>
              <span className="summary-value">{avgSaves.toFixed(1)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Gns. rednings %</span>
              <span className="summary-value">{avgPct.toFixed(1)}%</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-overlay-inline">
            <div className="spinner-small"></div>
            <p>Henter kampe...</p>
          </div>
        ) : (
          <div className="match-list">
            {matches.length === 0 ? (
              <p className="no-matches">Ingen gemte kampe endnu.</p>
            ) : (
              matches.map(match => {
<<<<<<< HEAD
                const totalSaves = Number(match.saves);
                const totalGoalsAgainst = Number(match.goals_against);
                const totalSavePct = (totalSaves / (totalSaves + totalGoalsAgainst)) * 100 || 0;
=======
                const saves = Number(match.saves);
                const goalsAgainst = Number(match.goals_against);
                const savePct = (saves / (saves + goalsAgainst)) * 100 || 0;
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d

                return (
                  <div key={match.id} className="match-card">
                    <div className="card-top">
                      <span className="match-date">
                        {new Date(match.created_at).toLocaleDateString('da-DK', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="league-tag">{match.league}</span>
                    </div>

                    <div className="match-teams">
                      <strong>{match.home_team}</strong> vs <strong>{match.away_team}</strong>
                    </div>

                    <div className="result-section">
                      <span className="stat-label">Resultat:</span>
                      <span className="score-display">{match.team_goals} - {match.goals_against}</span>
                    </div>

<<<<<<< HEAD
                    {/* Samlede hold-stats */}
                    <div className="stats-grid">
                      <div className="stat-item">
                        <span className="stat-label">Redninger (Total)</span>
                        <span className="stat-value">{match.saves}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Rednings % (Total)</span>
                        <span className={`stat-value ${totalSavePct >= 40 ? 'pct-high' : ''}`}>
                          {totalSavePct.toFixed(1)}%
=======
                    <div className="stats-grid">
                      <div className="stat-item">
                        <span className="stat-label">Redninger</span>
                        <span className="stat-value">{match.saves}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Rednings %</span>
                        <span className={`stat-value ${savePct >= 40 ? 'pct-high' : ''}`}>
                          {savePct.toFixed(1)}%
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
                        </span>
                      </div>
                    </div>

<<<<<<< HEAD
                    {/* MÅLMÆND INDIVIDUELLE STATS */}
                    {match.goalkeepers && match.goalkeepers.length > 0 && (
                      <div className="gk-history-section">
                        <p className="gk-history-title">Målmænd i kampen:</p>
                        {match.goalkeepers.map(gk => {
                          const gkSaves = Number(gk.saves);
                          const gkGoals = Number(gk.goals_against);
                          const gkPct = (gkSaves / (gkSaves + gkGoals)) * 100 || 0;

                          return (
                            <div key={gk.gk_id} className="gk-history-row">
                              <span className="gk-history-name">🛡️ {gk.gk_name}</span>
                              <span className="gk-history-stats">
                                Redn: <strong>{gk.saves}</strong> | Mål imod: <strong>{gk.goals_against}</strong> | %: <strong className={gkPct >= 40 ? 'pct-high' : ''}>{gkPct.toFixed(1)}%</strong>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

=======
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
                    <div className="history-actions">
                      <button className="edit-btn" onClick={() => onEdit(match)}>
                        Rediger
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(match.id)}>
                        Slet
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;