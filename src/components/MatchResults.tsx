// components/MatchResults.tsx
interface MatchResultsProps {
  savePercentage: number;
  totalEfficiency: number;
}

export const MatchResults = ({ savePercentage, totalEfficiency }: MatchResultsProps) => (
  <div className="results">
    <h3>Statistik</h3>
    <p>Redningsprocent: <strong>{savePercentage.toFixed(1)}%</strong></p>
    <p>Total effektivitet: <strong>{totalEfficiency.toFixed(1)}%</strong></p>
  </div>
);