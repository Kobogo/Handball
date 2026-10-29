import { useState, useEffect } from 'react';

export type Action = 'goal' | 'save' | 'miss' | 'team_goal';
<<<<<<< HEAD
export type League = 'Roskilde Håndbold 3' | 'Roskilde Håndbold 4' | '';

export interface Goalkeeper {
  id: string;
  name: string;
}
=======
export type League = 'U11' | 'U13' | '';
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d

interface MatchInfo {
  league: League;
  homeTeam: string;
  awayTeam: string;
<<<<<<< HEAD
  goalkeepers: Goalkeeper[];
}

export interface ActionLog {
  action: Action;
  goalkeeperId?: string;
}

export function useMatchStats() {
  const [history, setHistory] = useState<ActionLog[]>(() => {
=======
}

export function useMatchStats() {
  const [history, setHistory] = useState<Action[]>(() => {
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
    const saved = localStorage.getItem('hb_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(() => {
    const saved = localStorage.getItem('hb_matchInfo');
    return saved ? JSON.parse(saved) : null;
  });

<<<<<<< HEAD
  // Liste over tidligere brugte målmænd (August er altid med som standard med ID '1')
  const [savedGoalkeepers, setSavedGoalkeepers] = useState<Goalkeeper[]>(() => {
    const saved = localStorage.getItem('hb_savedGks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [{ id: '1', name: 'August' }];
  });

  const [activeGoalkeeperId, setActiveGoalkeeperId] = useState<string>(() => {
    return localStorage.getItem('hb_activeGk') || '';
  });

=======
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
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
<<<<<<< HEAD
    localStorage.setItem('hb_savedGks', JSON.stringify(savedGoalkeepers));
    localStorage.setItem('hb_activeGk', activeGoalkeeperId);
    localStorage.setItem('hb_isQuickReset', isQuickReset.toString());
  }, [history, matchId, matchInfo, savedGoalkeepers, activeGoalkeeperId, isQuickReset]);

  // Samlede hold-stats
  const stats = {
    goals: history.filter(a => a.action === 'goal').length,
    saves: history.filter(a => a.action === 'save').length,
    missed: history.filter(a => a.action === 'miss').length,
    teamGoals: history.filter(a => a.action === 'team_goal').length,
  };

  // Hent stats for en specifik målmand (eller holdet)
  const getStatsForGk = (gkId: string) => {
    const gkActions = history.filter(a => a.goalkeeperId === gkId);
    const goals = gkActions.filter(a => a.action === 'goal').length;
    const saves = gkActions.filter(a => a.action === 'save').length;
    const missed = gkActions.filter(a => a.action === 'miss').length;
    const teamGoals = stats.teamGoals;

    const savePercentage = (goals + saves) === 0 ? 0 : (saves / (goals + saves)) * 100;
    const totalEfficiency = (goals + saves + missed) === 0 ? 0 : ((saves + missed) / (goals + saves + missed)) * 100;
    
    return { goals, saves, missed, teamGoals, savePercentage, totalEfficiency };
=======
    localStorage.setItem('hb_isQuickReset', isQuickReset.toString());
  }, [history, matchId, matchInfo, isQuickReset]);

  const stats = {
    goals: history.filter(a => a === 'goal').length,
    saves: history.filter(a => a === 'save').length,
    missed: history.filter(a => a === 'miss').length,
    teamGoals: history.filter(a => a === 'team_goal').length,
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
  };

  const savePercentage = (stats.goals + stats.saves) === 0 ? 0 : (stats.saves / (stats.goals + stats.saves)) * 100;
  const totalEfficiency = (stats.goals + stats.saves + stats.missed) === 0 ? 0 : ((stats.saves + stats.missed) / (stats.goals + stats.saves + stats.missed)) * 100;

<<<<<<< HEAD
=======
  // NY FUNKTION: Indlæs eksisterende kamp til redigering
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
  const loadMatchForEdit = (match: any) => {
    setIsLoading(true);
    setMatchId(match.id);
    setMatchInfo({
      league: match.league,
      homeTeam: match.home_team,
<<<<<<< HEAD
      awayTeam: match.away_team,
      goalkeepers: [{ id: '1', name: 'August' }]
    });

    const newHistory: ActionLog[] = [
      ...Array(Number(match.saves)).fill({ action: 'save', goalkeeperId: '1' }),
      ...Array(Number(match.goals_against)).fill({ action: 'goal', goalkeeperId: '1' }),
      ...Array(Number(match.missed)).fill({ action: 'miss', goalkeeperId: '1' }),
      ...Array(Number(match.team_goals)).fill({ action: 'team_goal' }),
    ];
    setHistory(newHistory);
    setActiveGoalkeeperId('1');
=======
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
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
    setIsQuickReset(false);
    setIsLoading(false);
  };

  const handleAction = async (action: Action) => {
<<<<<<< HEAD
    const goalkeeperId = action === 'team_goal' ? undefined : activeGoalkeeperId;
    setHistory(prev => [...prev, { action, goalkeeperId }]);

=======
    setHistory(prev => [...prev, action]);
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
    if (matchId && !isQuickReset) {
      try {
        await fetch(`${API_URL}/api/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
<<<<<<< HEAD
          body: JSON.stringify({ matchId, actionType: action, goalkeeperId })
=======
          body: JSON.stringify({ matchId, actionType: action })
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
        });
      } catch (error) { console.error(error); }
    }
  };

  const handleUndo = async (actionToRemove: Action) => {
<<<<<<< HEAD
    const index = history.slice().reverse().findIndex(h => 
      h.action === actionToRemove && (actionToRemove === 'team_goal' || h.goalkeeperId === activeGoalkeeperId)
    );

    if (index !== -1) {
      const realIndex = history.length - 1 - index;
      const newHistory = [...history];
      newHistory.splice(realIndex, 1);
=======
    const index = history.lastIndexOf(actionToRemove);
    if (index !== -1) {
      const newHistory = [...history];
      newHistory.splice(index, 1);
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
      setHistory(newHistory);

      if (matchId && !isQuickReset) {
        try {
          await fetch(`${API_URL}/api/events/undo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
<<<<<<< HEAD
            body: JSON.stringify({ matchId, actionType: actionToRemove, goalkeeperId: activeGoalkeeperId })
=======
            body: JSON.stringify({ matchId, actionType: actionToRemove })
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
          });
        } catch (error) { console.error(error); }
      }
    }
  };

  const startNewMatch = async (info: MatchInfo) => {
    setIsLoading(true);
    setHistory([]);
    setMatchId(null);
<<<<<<< HEAD
    setIsQuickReset(false);

    // Gennemgå målmændene og tildel pæne fortløbende ID'er ('1', '2', '3' osv.)
    const updatedGoalkeepers = [...savedGoalkeepers];
    
    const processedGoalkeepers = info.goalkeepers.map((gk) => {
      const existing = updatedGoalkeepers.find(
        (e) => e.name.toLowerCase() === gk.name.toLowerCase()
      );

      if (existing) {
        return existing;
      } else {
        const nextId = (updatedGoalkeepers.length + 1).toString();
        const newGk = { id: nextId, name: gk.name };
        updatedGoalkeepers.push(newGk);
        return newGk;
      }
    });

    setSavedGoalkeepers(updatedGoalkeepers);

    const updatedMatchInfo = {
      ...info,
      goalkeepers: processedGoalkeepers,
    };
    setMatchInfo(updatedMatchInfo);

    if (processedGoalkeepers && processedGoalkeepers.length > 0) {
      setActiveGoalkeeperId(processedGoalkeepers[0].id);
    }

=======
    setMatchInfo(info);
    setIsQuickReset(false);

>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
    try {
      const response = await fetch(`${API_URL}/api/matches/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
<<<<<<< HEAD
        body: JSON.stringify({
          league: updatedMatchInfo.league,
          homeTeam: updatedMatchInfo.homeTeam,
          awayTeam: updatedMatchInfo.awayTeam,
          goalkeepers: processedGoalkeepers
        })
=======
        body: JSON.stringify(info)
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
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
<<<<<<< HEAD
    try {
      const response = await fetch(`${API_URL}/api/matches/${id}`, { method: 'DELETE' });
=======

    try {
      const response = await fetch(`${API_URL}/api/matches/${id}`, {
        method: 'DELETE',
      });
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
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
<<<<<<< HEAD
    setActiveGoalkeeperId('');
=======
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
    setIsQuickReset(true);
    localStorage.clear();
  };

  return {
    stats, matchInfo, isQuickReset, savePercentage, totalEfficiency,
<<<<<<< HEAD
    activeGoalkeeperId, setActiveGoalkeeperId, getStatsForGk, savedGoalkeepers,
=======
>>>>>>> a75d83e9237ad663553ead4d5c944d07d1b4fa6d
    handleAction, handleUndo, startNewMatch, quickReset, isLoading,
    loadMatchForEdit, deleteMatch
  };
}