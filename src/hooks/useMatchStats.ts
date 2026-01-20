import { useState, useEffect } from 'react';

export type Action = 'goal' | 'save' | 'miss' | 'team_goal';
export type League = 'U11' | 'U13' | '';

interface MatchInfo {
  league: League;
  homeTeam: string;
  awayTeam: string;
}

export function useMatchStats() {
  const [history, setHistory] = useState<Action[]>(() => {
    const saved = localStorage.getItem('hb_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(() => {
    const saved = localStorage.getItem('hb_matchInfo');
    return saved ? JSON.parse(saved) : null;
  });

  const [matchId, setMatchId] = useState<number | null>(() => {
    const saved = localStorage.getItem('hb_matchId');
    return saved ? Number(saved) : null;
  });

  const [isQuickReset, setIsQuickReset] = useState(() => {
    return localStorage.getItem('hb_isQuickReset') === 'true';
  });

  const [isLoading, setIsLoading] = useState(false);
  const API_URL = "https://handball-backend-xwvh.onrender.com";

  useEffect(() => {
    localStorage.setItem('hb_history', JSON.stringify(history));
    localStorage.setItem('hb_matchId', matchId ? matchId.toString() : '');
    localStorage.setItem('hb_matchInfo', JSON.stringify(matchInfo));
    localStorage.setItem('hb_isQuickReset', isQuickReset.toString());
  }, [history, matchId, matchInfo, isQuickReset]);

  const stats = {
    goals: history.filter(a => a === 'goal').length,
    saves: history.filter(a => a === 'save').length,
    missed: history.filter(a => a === 'miss').length,
    teamGoals: history.filter(a => a === 'team_goal').length,
  };

  const savePercentage = (stats.goals + stats.saves) === 0 ? 0 : (stats.saves / (stats.goals + stats.saves)) * 100;
  const totalEfficiency = (stats.goals + stats.saves + stats.missed) === 0 ? 0 : ((stats.saves + stats.missed) / (stats.goals + stats.saves + stats.missed)) * 100;

  // NY FUNKTION: Indlæs eksisterende kamp til redigering
  const loadMatchForEdit = (match: any) => {
    setIsLoading(true);
    setMatchId(match.id);
    setMatchInfo({
      league: match.league,
      homeTeam: match.home_team,
      awayTeam: match.away_team
    });

    // Genskab historik-array baseret på tallene fra databasen
    const newHistory: Action[] = [
      ...Array(Number(match.saves)).fill('save'),
      ...Array(Number(match.goals_against)).fill('goal'),
      ...Array(Number(match.missed)).fill('miss'),
      ...Array(Number(match.team_goals)).fill('team_goal'),
    ];
    setHistory(newHistory);
    setIsQuickReset(false);
    setIsLoading(false);
  };

  const handleAction = async (action: Action) => {
    setHistory(prev => [...prev, action]);
    if (matchId && !isQuickReset) {
      try {
        await fetch(`${API_URL}/api/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matchId, actionType: action })
        });
      } catch (error) { console.error(error); }
    }
  };

  const handleUndo = async (actionToRemove: Action) => {
    const index = history.lastIndexOf(actionToRemove);
    if (index !== -1) {
      const newHistory = [...history];
      newHistory.splice(index, 1);
      setHistory(newHistory);

      if (matchId && !isQuickReset) {
        try {
          await fetch(`${API_URL}/api/events/undo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matchId, actionType: actionToRemove })
          });
        } catch (error) { console.error(error); }
      }
    }
  };

  const startNewMatch = async (info: MatchInfo) => {
    setIsLoading(true);
    setHistory([]);
    setMatchId(null);
    setMatchInfo(info);
    setIsQuickReset(false);

    try {
      const response = await fetch(`${API_URL}/api/matches/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
      });
      if (response.ok) {
        const data = await response.json();
        setMatchId(data.matchId);
      }
    } catch (error) { console.error(error); }
    finally { setIsLoading(false); }
  };

  const deleteMatch = async (id: number) => {
    if (!window.confirm("Er du sikker på, at du vil slette denne kamp permanent?")) return false;

    try {
      const response = await fetch(`${API_URL}/api/matches/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error("Fejl ved sletning:", error);
      return false;
    }
  };

  const quickReset = () => {
    setHistory([]);
    setMatchInfo(null);
    setMatchId(null);
    setIsQuickReset(true);
    localStorage.clear();
  };

  return {
    stats, matchInfo, isQuickReset, savePercentage, totalEfficiency,
    handleAction, handleUndo, startNewMatch, quickReset, isLoading,
    loadMatchForEdit, deleteMatch
  };
}