import { getTeam } from '../data/teams';
import type { BracketMatch } from '../data/bracket';

interface BracketSlotProps {
  match: BracketMatch;
  simMode: boolean;
  onPickWinner?: (matchId: string, winnerId: string) => void;
}

function SlotTeam({
  teamId,
  label,
  isWinner,
  simMode,
  matchId,
  onPick,
}: {
  teamId: string | null;
  label?: string;
  isWinner?: boolean;
  simMode: boolean;
  matchId: string;
  onPick?: (matchId: string, winnerId: string) => void;
}) {
  if (!teamId) {
    return (
      <div className="bracket-slot empty">
        <span className="tbd">{label ?? 'TBD'}</span>
      </div>
    );
  }

  const team = getTeam(teamId);
  const clickable = simMode && onPick && teamId && !isWinner;

  return (
    <button
      type="button"
      className={`bracket-slot ${isWinner ? 'winner' : ''} ${clickable ? 'clickable' : ''}`}
      onClick={() => clickable && onPick(matchId, teamId)}
      disabled={!clickable}
    >
      <span className="team-flag small">{team.flag}</span>
      <span className="slot-abbr">{team.abbr}</span>
      {label && <span className="slot-seed">{label}</span>}
    </button>
  );
}

export function BracketMatchCard({ match, simMode, onPickWinner }: BracketSlotProps) {
  return (
    <div className={`bracket-match ${match.round}`}>
      <SlotTeam
        teamId={match.homeId}
        label={match.homeLabel}
        isWinner={match.winnerId === match.homeId}
        simMode={simMode}
        matchId={match.id}
        onPick={onPickWinner}
      />
      <div className="bracket-divider" />
      <SlotTeam
        teamId={match.awayId}
        label={match.awayLabel}
        isWinner={match.winnerId === match.awayId}
        simMode={simMode}
        matchId={match.id}
        onPick={onPickWinner}
      />
    </div>
  );
}

interface BracketViewProps {
  matches: BracketMatch[];
  simMode: boolean;
  onPickWinner?: (matchId: string, winnerId: string) => void;
}

export function BracketView({ matches, simMode, onPickWinner }: BracketViewProps) {
  const rounds = ['r32', 'r16', 'qf', 'sf', 'final'] as const;
  const roundLabels: Record<string, string> = {
    r32: 'Round of 32',
    r16: 'Round of 16',
    qf: 'Quarter-Finals',
    sf: 'Semi-Finals',
    final: 'Final',
  };

  return (
    <div className="bracket-container">
      {rounds.map(round => {
        const roundMatches = matches.filter(m => m.round === round);
        if (roundMatches.length === 0) return null;

        return (
          <div key={round} className={`bracket-round col-${round}`}>
            <h4 className="bracket-round-label">{roundLabels[round]}</h4>
            <div className="bracket-round-matches">
              {roundMatches.map(m => (
                <BracketMatchCard
                  key={m.id}
                  match={m}
                  simMode={simMode}
                  onPickWinner={onPickWinner}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
