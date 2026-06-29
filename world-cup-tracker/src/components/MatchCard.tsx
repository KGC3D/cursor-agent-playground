import type { Team } from '../data/teams';
import { getTeam } from '../data/teams';
import type { Match, MatchStatus } from '../data/matches';

interface TeamRowProps {
  team: Team;
  score: number;
  isWinner?: boolean;
  isLoser?: boolean;
}

export function TeamRow({ team, score, isWinner, isLoser }: TeamRowProps) {
  return (
    <div className={`team-row ${isWinner ? 'winner' : ''} ${isLoser ? 'loser' : ''}`}>
      <div className="team-info">
        <span className="team-flag">{team.flag}</span>
        <span className="team-abbr">{team.abbr}</span>
      </div>
      <span className="team-score">{score}</span>
    </div>
  );
}

interface MatchCardProps {
  match: Match;
  compact?: boolean;
}

function StatusBadge({ status, minute }: { status: MatchStatus; minute?: number }) {
  if (status === 'live') {
    return (
      <span className="status-badge live">
        <span className="live-dot" />
        {minute}'
      </span>
    );
  }
  if (status === 'halftime') {
    return <span className="status-badge halftime">HT</span>;
  }
  if (status === 'finished') {
    return <span className="status-badge finished">FT</span>;
  }
  return <span className="status-badge scheduled">{minute ? '' : 'Upcoming'}</span>;
}

export function MatchCard({ match, compact }: MatchCardProps) {
  const home = getTeam(match.homeId);
  const away = getTeam(match.awayId);
  const isLive = match.status === 'live' || match.status === 'halftime';
  const isFinished = match.status === 'finished';
  const homeWins = isFinished && match.homeScore > match.awayScore;
  const awayWins = isFinished && match.awayScore > match.homeScore;

  return (
    <div className={`match-card ${isLive ? 'is-live' : ''} ${compact ? 'compact' : ''}`}>
      <div className="match-card-header">
        <span className="match-stage">
          {match.group ? `Group ${match.group}` : match.stage}
        </span>
        <StatusBadge status={match.status} minute={match.minute} />
      </div>

      <div className="match-teams">
        <TeamRow
          team={home}
          score={match.status === 'scheduled' ? 0 : match.homeScore}
          isWinner={homeWins}
          isLoser={awayWins}
        />
        <TeamRow
          team={away}
          score={match.status === 'scheduled' ? 0 : match.awayScore}
          isWinner={awayWins}
          isLoser={homeWins}
        />
      </div>

      {!compact && (
        <div className="match-meta">
          <span>{match.venue}</span>
          <span className="meta-dot">·</span>
          <span>{match.city}</span>
        </div>
      )}
    </div>
  );
}
