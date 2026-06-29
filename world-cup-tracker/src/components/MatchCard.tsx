import type { Team } from '../data/teams';
import { getTeam } from '../data/teams';
import type { Match, MatchStatus } from '../data/matches';
import { formatKickoffMountain, getRelativeDay, formatRelativeDayLabel, formatScheduleMountain } from '../utils/timezone';
import { formatResultHeader } from '../utils/resultGroups';
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
  schedule?: boolean;
  result?: boolean;
}

function StatusBadge({ status, minute, clock, final: isFinal }: {
  status: MatchStatus;
  minute?: number;
  clock?: string;
  final?: boolean;
}) {
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
    return (
      <span className={`status-badge finished ${isFinal ? 'final' : ''}`}>
        {isFinal ? 'FINAL' : 'FT'}
      </span>
    );
  }
  return <span className="status-badge scheduled">{minute ? '' : 'Upcoming'}</span>;
}

function VenueMeta({ match, muted }: { match: Match; muted?: boolean }) {
  const line = formatVenueLine({
    stadium: match.stadium,
    city: match.city,
    region: match.region,
    country: match.country,
  });

  return (
    <div className={`match-venue ${muted ? 'muted' : ''}`}>
      <span className="venue-pin" aria-hidden>📍</span>
      <span className="venue-text">{line}</span>
    </div>
  );
}

export function MatchCard({ match, compact, schedule, result }: MatchCardProps) {
  const home = getTeam(match.homeId);
  const away = getTeam(match.awayId);
  const isLive = match.status === 'live' || match.status === 'halftime';
  const isFinished = match.status === 'finished';
  const homeWins = isFinished && match.homeScore > match.awayScore;
  const awayWins = isFinished && match.awayScore > match.homeScore;

  const isScheduled = match.status === 'scheduled';
  const showScores = !isScheduled;
  const relative = getRelativeDay(match.kickoffUtc);
  const relativeLabel = !result ? formatRelativeDayLabel(relative) : null;
  const scheduleInfo = schedule && match.kickoffUtc
    ? formatScheduleMountain(match.kickoffUtc)
    : null;

  if (result && isFinished) {
    return (
      <div className="match-card is-result">
        <div className="result-card-banner">
          <span className="result-done-label">Final</span>
          <span className="result-played-at">{formatResultHeader(match)}</span>
        </div>

        <div className="match-card-header">
          <span className="match-stage">
            {match.group ? `Group ${match.group}` : match.stage}
          </span>
          <StatusBadge status={match.status} final />
        </div>

        <div className="match-teams result-scores">
          <TeamRow team={home} score={match.homeScore} isWinner={homeWins} isLoser={awayWins} />
          <TeamRow team={away} score={match.awayScore} isWinner={awayWins} isLoser={homeWins} />
        </div>

        <VenueMeta match={match} muted />
      </div>
    );
  }

  return (
    <div className={`match-card ${isLive ? 'is-live' : ''} ${compact ? 'compact' : ''} ${schedule ? 'schedule' : ''} ${isScheduled ? 'is-upcoming' : ''} ${relative ? `is-${relative}` : ''}`}>
      {scheduleInfo ? (
        <div className={`schedule-card-header ${scheduleInfo.relative ?? ''}`}>
          <span className="schedule-day">{scheduleInfo.day}</span>
          {scheduleInfo.subday && (
            <span className="schedule-subday">{scheduleInfo.subday}</span>
          )}
          <span className="schedule-time">{scheduleInfo.time}</span>
        </div>
      ) : relativeLabel ? (
        <div className={`relative-day-badge ${relative}`}>{relativeLabel}</div>
      ) : null}

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

      {isScheduled && match.kickoffUtc && !schedule && (
        <div className="match-kickoff">
          Kickoff {formatKickoffMountain(match.kickoffUtc)}
        </div>
      )}
    </div>
  );
}
