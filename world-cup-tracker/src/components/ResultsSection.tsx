import type { Match } from '../data/matches';
import { MatchCard } from './MatchCard';
import { groupResultsByDate } from '../utils/resultGroups';

interface ResultsSectionProps {
  matches: Match[];
  phaseLabel: string;
  hasUpcoming?: boolean;
}

export function ResultsSection({ matches, phaseLabel, hasUpcoming = true }: ResultsSectionProps) {
  if (matches.length === 0) return null;

  const groups = groupResultsByDate(matches);

  return (
    <div className="results-section">
      <div className="results-section-header">
        <div className="results-section-title">
          <span className="results-icon" aria-hidden>✓</span>
          <div>
            <h2 className="section-title">Completed</h2>
            <p className="section-subtitle">
              {matches.length} match{matches.length !== 1 ? 'es' : ''} · {phaseLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="results-groups">
        {groups.map(group => (
          <div key={group.key} className="results-date-group">
            <h3 className="results-date-label">{group.label}</h3>
            <div className="match-list">
              {group.matches.map(m => (
                <MatchCard key={m.id} match={m} result />
              ))}
            </div>
          </div>
        ))}
      </div>

      {hasUpcoming && (
        <div className="section-divider">
          <span>Upcoming</span>
        </div>
      )}
    </div>
  );
}
