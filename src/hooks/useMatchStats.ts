import { useState, useEffect } from 'react';

export type Action = 'goal' | 'save' | 'miss' | 'team_goal';
export type League = 'Roskilde Håndbold 3' | 'Roskilde Håndbold 4' | '';

export interface Goalkeeper {
  id: string;
  name: string;
}

interface MatchInfo {
  league: League;
  homeTeam: string;
  awayTeam: string;
  goalkeepers: Goalkeeper[];
}

export interface ActionLog {
  action: Action;
  goalkeeperId?: string;
}

export function useMatchStats() {
  const [history, setHistory] = useState<ActionLog[]>(() => {
    const saved = localStorage.getItem('hb_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(() => {
    const saved = localStorage.getItem('hb_matchInfo');
    return saved ? JSON.parse(saved) : null;
  });

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

    // Samlede mål imod alle målmænd i kampen (til måltavlen)
    const totalGoalsAgainst = history.filter(a => a.action === 'goal').length;

    const savePercentage = (goals + saves) === 0 ? 0 : (saves / (goals + saves)) * 100;
    const totalEfficiency = (goals + saves + missed) === 0 ? 0 : ((saves + missed) / (goals + saves + missed)) * 100;
    
    return { goals, saves, missed, teamGoals, totalGoalsAgainst, savePercentage, totalEfficiency };
  };

  const savePercentage = (stats.goals + stats.saves) === 0 ? 0 : (stats.saves / (stats.goals + stats.saves)) * 100;
  const totalEfficiency = (stats.goals + stats.saves + stats.missed) === 0 ? 0 : ((stats.saves + stats.missed) / (stats.goals + stats.saves + stats.missed)) * 100;

  const loadMatchForEdit = (match: any) => {
    setIsLoading(true);
    setMatchId(match.id);

    // 1. Hent målmændene for kampen
    const matchGoalkeepers: Goalkeeper[] = 
      match.goalkeepers && match.goalkeepers.length > 0
        ? match.goalkeepers.map((gk: any) => ({
            id: String(gk.gk_id),
            name: gk.gk_name
          }))
        : [{ id: '1', name: 'August' }];

    setMatchInfo({
      league: match.league,
      homeTeam: match.home_team,
      awayTeam: match.away_team,
      goalkeepers: matchGoalkeepers
    });

    // 2. Opbyg historikken (history) præcist for hver enkelt målmand baseret på databasens data
    const reconstructedHistory: ActionLog[] = [];

    if (match.goalkeepers && match.goalkeepers.length > 0) {
      match.goalkeepers.for_each ? match.goalkeepers.forEach((gk: any) => {}) : null; // (sikkerhed)
      
      // Løb igennem hver målmand og genskab deres redninger og mål imod
      match.goalkeepers.forEach((gk: any) => {
        const gkId = String(gk.gk_id);
        const savesCount = Number(gk.saves) || 0;
        const goalsCount = Number(gk.goals_against) || 0;
        const missedCount = Number(gk.missed) || 0;

        // Tilføj redninger til denne målmand
        for (let i = 0; i < savesCount; i++) {
          reconstructedHistory.push({ action: 'save', goalkeeperId: gkId });
        }
        // Tilføj mål imod til denne målmand
        for (let i = 0; i < goalsCount; i++) {
          reconstructedHistory.push({ action: 'goal', goalkeeperId: gkId });
        }
        // Tilføj forbi til denne målmand
        for (let i = 0; i < missedCount; i++) {
          reconstructedHistory.push({ action: 'miss', goalkeeperId: gkId });
        }
      });
    } else {
      // Fallback hvis der mod forventning ikke er målmandsdata
      const firstGkId = matchGoalkeepers[0].id;
      for (let i = 0; i < Number(match.saves); i++) reconstructedHistory.push({ action: 'save', goalkeeperId: firstGkId });
      for (let i = 0; i < Number(match.goals_against); i++) reconstructedHistory.push({ action: 'goal', goalkeeperId: firstGkId });
      for (let i = 0; i < Number(match.missed); i++) reconstructedHistory.push({ action: 'miss', goalkeeperId: firstGkId });
    }

    // 3. Tilføj holdets mål (team_goals) som ikke er knyttet til en specifik målmand
    const teamGoalsCount = Number(match.team_goals) || 0;
    for (let i = 0; i < teamGoalsCount; i++) {
      reconstructedHistory.push({ action: 'team_goal' });
    }

    setHistory(reconstructedHistory);
    setActiveGoalkeeperId(matchGoalkeepers[0].id);
    setIsQuickReset(false);
    setIsLoading(false);
  };

  const handleAction = async (action: Action) => {
    const goalkeeperId = action === 'team_goal' ? undefined : activeGoalkeeperId;
    setHistory(prev => [...prev, { action, goalkeeperId }]);

    if (matchId && !isQuickReset) {
      try {
        await fetch(`${API_URL}/api/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matchId, actionType: action, goalkeeperId })
        });
      } catch (error) { console.error(error); }
    }
  };

  const handleUndo = async (actionToRemove: Action) => {
    const index = history.slice().reverse().findIndex(h => 
      h.action === actionToRemove && (actionToRemove === 'team_goal' || h.goalkeeperId === activeGoalkeeperId)
    );

    if (index !== -1) {
      const realIndex = history.length - 1 - index;
      const newHistory = [...history];
      newHistory.splice(realIndex, 1);
      setHistory(newHistory);

      if (matchId && !isQuickReset) {
        try {
          // Send KUN goalkeeperId med hvis det IKKE er et holdmål
          const bodyData: any = { matchId, actionType: actionToRemove };
          if (actionToRemove !== 'team_goal') {
            bodyData.goalkeeperId = activeGoalkeeperId;
          }

          await fetch(`${API_URL}/api/events/undo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
          });
        } catch (error) { console.error(error); }
      }
    }
  };

  const startNewMatch = async (info: MatchInfo) => {
    setIsLoading(true);
    setHistory([]);
    setMatchId(null);
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

    try {
      const response = await fetch(`${API_URL}/api/matches/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          league: updatedMatchInfo.league,
          homeTeam: updatedMatchInfo.homeTeam,
          awayTeam: updatedMatchInfo.awayTeam,
          goalkeepers: processedGoalkeepers
        })
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
      const response = await fetch(`${API_URL}/api/matches/${id}`, { method: 'DELETE' });
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
    setActiveGoalkeeperId('');
    setIsQuickReset(true);
    localStorage.clear();
  };

  return {
    stats, matchInfo, isQuickReset, savePercentage, totalEfficiency,
    activeGoalkeeperId, setActiveGoalkeeperId, getStatsForGk, savedGoalkeepers,
    handleAction, handleUndo, startNewMatch, quickReset, isLoading,
    loadMatchForEdit, deleteMatch
  };
}