import type { Team } from '../data/teams';
import { getTeam } from '../data/teams';
import type { Match, MatchStatus } from '../data/matches';
import { formatKickoffTime } from '../data/matches';
import { formatVenueLine } from '../data/venues';

interface TeamRowProps {
  team: Team;
  score?: number;
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
      {score !== undefined && <span className="team-score">{score}</span>}
    </div>
  );
}

interface MatchCardProps {
  match: Match;
  compact?: boolean;
}

function StatusBadge({ status, minute, clock }: { status: MatchStatus; minute?: number; clock?: string }) {
  if (status === 'live') {
    return (
      <span className="status-badge live">
        <span className="live-dot" />
        {clock ?? (minute ? `${minute}'` : 'LIVE')}
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

function VenueMeta({ match }: { match: Match }) {
  const line = formatVenueLine({
    stadium: match.stadium,
    city: match.city,
    region: match.region,
    country: match.country,
  });

  return (
    <div className="match-venue">
      <span className="venue-pin" aria-hidden>📍</span>
      <span className="venue-text">{line}</span>
    </div>
  );
}

export function MatchCard({ match, compact }: MatchCardProps) {
  const home = getTeam(match.homeId);
  const away = getTeam(match.awayId);
  const isLive = match.status === 'live' || match.status === 'halftime';
  const isFinished = match.status === 'finished';
  const homeWins = isFinished && match.homeScore > match.awayScore;
  const awayWins = isFinished && match.awayScore > match.homeScore;

  const isScheduled = match.status === 'scheduled';
  const showScores = !isScheduled;

  return (
    <div className={`match-card ${isLive ? 'is-live' : ''} ${compact ? 'compact' : ''} ${isScheduled ? 'is-upcoming' : ''}`}>
      <div className="match-card-header">
        <span className="match-stage">
          {match.group ? `Group ${match.group}` : match.stage}
        </span>
        <StatusBadge status={match.status} minute={match.minute} clock={match.clock} />
      </div>

      <div className="match-teams">
        <TeamRow
          team={home}
          score={showScores ? match.homeScore : undefined}
          isWinner={homeWins}
          isLoser={awayWins}
        />
        <TeamRow
          team={away}
          score={showScores ? match.awayScore : undefined}
          isWinner={awayWins}
          isLoser={homeWins}
        />
      </div>

      <VenueMeta match={match} />

      {isScheduled && (
        <div className="match-kickoff">
          Kickoff {formatKickoffTime(match.time)}
        </div>
      )}
    </div>
  );
}
