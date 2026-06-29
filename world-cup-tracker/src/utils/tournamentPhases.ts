import type { Match } from '../data/matches';
import { mountainDateKey, mountainTodayKey, mountainTomorrowKey } from './timezone';

export type TournamentPhase =
  | 'group'
  | 'r32'
  | 'r16'
  | 'qf'
  | 'sf'
  | 'third'
  | 'final';

export const PHASE_ORDER: TournamentPhase[] = [
  'group', 'r32', 'r16', 'qf', 'sf', 'third', 'final',
];

export const PHASE_LABELS: Record<TournamentPhase, string> = {
  group: 'Group Stage',
  r32: 'Round of 32',
  r16: 'Round of 16',
  qf: 'Quarter-Finals',
  sf: 'Semi-Finals',
  third: 'Third Place',
  final: 'Final',
};

export const KNOCKOUT_PHASES: TournamentPhase[] = [
  'r32', 'r16', 'qf', 'sf', 'third', 'final',
];

export function getMatchPhase(match: Match): TournamentPhase {
  switch (match.stage) {
    case 'Group Stage': return 'group';
    case 'Round of 32': return 'r32';
    case 'Round of 16': return 'r16';
    case 'Quarter-Final': return 'qf';
    case 'Semi-Final': return 'sf';
    case 'Third Place': return 'third';
    case 'Final': return 'final';
    default:
      return match.group ? 'group' : 'r32';
  }
}

export function isKnockout(match: Match): boolean {
  return getMatchPhase(match) !== 'group';
}

export function phaseIndex(phase: TournamentPhase): number {
  return PHASE_ORDER.indexOf(phase);
}

/** Determine the active tournament round based on match states */
export function detectCurrentPhase(matches: Match[]): TournamentPhase {
  // Live matches define the current round
  const live = matches.filter(m => m.status === 'live' || m.status === 'halftime');
  if (live.length > 0) {
    return getMatchPhase(live[0]);
  }

  // First knockout/group phase that still has scheduled matches
  for (const phase of PHASE_ORDER) {
    const phaseMatches = matches.filter(m => getMatchPhase(m) === phase);
    if (phaseMatches.some(m => m.status === 'scheduled')) {
      return phase;
    }
  }

  // Tournament complete — show final
  const finalDone = matches.filter(
    m => getMatchPhase(m) === 'final' && m.status === 'finished'
  );
  if (finalDone.length > 0) return 'final';

  // Fallback: latest phase with any finished match
  for (let i = PHASE_ORDER.length - 1; i >= 0; i--) {
    const phase = PHASE_ORDER[i];
    if (matches.some(m => getMatchPhase(m) === phase && m.status === 'finished')) {
      return phase;
    }
  }

  return 'group';
}

export function matchesInPhase(matches: Match[], phase: TournamentPhase): Match[] {
  return matches.filter(m => getMatchPhase(m) === phase);
}

export function sortByKickoff(matches: Match[], desc = false): Match[] {
  return [...matches].sort((a, b) => {
    const diff = (a.kickoffUtc ?? 0) - (b.kickoffUtc ?? 0);
    return desc ? -diff : diff;
  });
}

export interface PhaseSection {
  phase: TournamentPhase;
  label: string;
  matches: Match[];
}

/** Group matches into phase sections, only including phases with matches */
export function groupByPhase(
  matches: Match[],
  phases: TournamentPhase[] = PHASE_ORDER
): PhaseSection[] {
  return phases
    .map(phase => ({
      phase,
      label: PHASE_LABELS[phase],
      matches: sortByKickoff(matchesInPhase(matches, phase)),
    }))
    .filter(s => s.matches.length > 0);
}

/** Finished matches for the current round only (not older phases) */
export function currentPhaseResults(
  matches: Match[],
  currentPhase: TournamentPhase
): Match[] {
  return sortByKickoff(
    matches.filter(
      m => getMatchPhase(m) === currentPhase && m.status === 'finished'
    ),
    true
  );
}

/** Today's matches filtered to current tournament phase (Mountain Time) */
export function todayInPhase(
  matches: Match[],
  currentPhase: TournamentPhase
): Match[] {
  const todayKey = mountainTodayKey();
  return sortByKickoff(
    matches.filter(
      m =>
        getMatchPhase(m) === currentPhase &&
        m.kickoffUtc &&
        mountainDateKey(m.kickoffUtc) === todayKey
    )
  );
}

/** Tomorrow's matches in current phase (Mountain Time) */
export function tomorrowInPhase(
  matches: Match[],
  currentPhase: TournamentPhase
): Match[] {
  const tomorrowKey = mountainTomorrowKey();
  return sortByKickoff(
    matches.filter(
      m =>
        getMatchPhase(m) === currentPhase &&
        m.status === 'scheduled' &&
        m.kickoffUtc &&
        mountainDateKey(m.kickoffUtc) === tomorrowKey
    )
  );
}

/** Upcoming schedule grouped by phase from current phase onward */
export function upcomingByPhase(
  matches: Match[],
  fromPhase: TournamentPhase
): PhaseSection[] {
  const fromIdx = phaseIndex(fromPhase);
  const phases = PHASE_ORDER.slice(fromIdx);
  const upcoming = matches.filter(m => m.status === 'scheduled');
  return groupByPhase(upcoming, phases);
}

/** Live matches — only from knockout when past group stage */
export function activeLiveMatches(
  matches: Match[],
  currentPhase: TournamentPhase
): Match[] {
  const live = matches.filter(m => m.status === 'live' || m.status === 'halftime');
  if (currentPhase === 'group') return live;
  return live.filter(m => isKnockout(m));
}
