interface StatsBoardProps {
  saves: number;
  goals: number;
  missed: number;
  teamGoals: number;
}

export const StatsBoard = ({ saves, goals, missed, teamGoals }: StatsBoardProps) => (
  <div className="stats-board">
    <div className="stat-item">
      <h2>{saves}</h2>
      <p>Redninger</p>
    </div>
    <div className="stat-item">
      <h2>{goals}</h2>
      <p>Mål scoret</p>
    </div>
    <div className="stat-item">
      <h2>{missed}</h2>
      <p>Skud forbi</p>
    </div>
    <div className="stat-item">
      <h2>{teamGoals}</h2>
      <p>Vores mål</p>
    </div>
  </div>
);