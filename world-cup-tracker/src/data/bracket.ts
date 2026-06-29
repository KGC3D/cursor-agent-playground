export interface BracketMatch {
  id: string;
  round: 'r32' | 'r16' | 'qf' | 'sf' | 'final';
  roundLabel: string;
  homeId: string | null;
  awayId: string | null;
  homeLabel?: string;
  awayLabel?: string;
  homeScore?: number;
  awayScore?: number;
  winnerId?: string | null;
  feedsFrom?: [string] | [string, string];
  position: number;
}

export const BRACKET_ROUNDS = [
  { key: 'r32' as const, label: 'Round of 32', cols: 8 },
  { key: 'r16' as const, label: 'Round of 16', cols: 4 },
  { key: 'qf' as const, label: 'Quarter-Finals', cols: 2 },
  { key: 'sf' as const, label: 'Semi-Finals', cols: 2 },
  { key: 'final' as const, label: 'Final', cols: 1 },
];

export const INITIAL_BRACKET: BracketMatch[] = [
  // Round of 32
  { id: 'b-r32-1', round: 'r32', roundLabel: 'Round of 32', homeId: 'usa', awayId: 'kor', homeLabel: '1A', awayLabel: '2C', position: 0 },
  { id: 'b-r32-2', round: 'r32', roundLabel: 'Round of 32', homeId: 'mex', awayId: 'ger', homeLabel: '2A', awayLabel: '2E', position: 1 },
  { id: 'b-r32-3', round: 'r32', roundLabel: 'Round of 32', homeId: 'bra', awayId: 'uru', homeLabel: '1C', awayLabel: '2H', position: 2 },
  { id: 'b-r32-4', round: 'r32', roundLabel: 'Round of 32', homeId: 'cro', awayId: 'esp', homeLabel: '2C', awayLabel: '1F', position: 3 },
  { id: 'b-r32-5', round: 'r32', roundLabel: 'Round of 32', homeId: 'arg', awayId: 'fra', homeLabel: '1D', awayLabel: '1B', position: 4 },
  { id: 'b-r32-6', round: 'r32', roundLabel: 'Round of 32', homeId: 'eng', awayId: 'col', homeLabel: '1G', awayLabel: '3A/B/C', position: 5 },
  { id: 'b-r32-7', round: 'r32', roundLabel: 'Round of 32', homeId: 'ned', awayId: 'bel', homeLabel: '1E', awayLabel: '2F', position: 6 },
  { id: 'b-r32-8', round: 'r32', roundLabel: 'Round of 32', homeId: 'jpn', awayId: 'can', homeLabel: '3D/E/F', awayLabel: '2B', position: 7 },

  // Round of 16
  { id: 'b-r16-1', round: 'r16', roundLabel: 'Round of 16', homeId: null, awayId: null, position: 0, feedsFrom: ['b-r32-1', 'b-r32-2'] },
  { id: 'b-r16-2', round: 'r16', roundLabel: 'Round of 16', homeId: null, awayId: null, position: 1, feedsFrom: ['b-r32-3', 'b-r32-4'] },
  { id: 'b-r16-3', round: 'r16', roundLabel: 'Round of 16', homeId: null, awayId: null, position: 2, feedsFrom: ['b-r32-5', 'b-r32-6'] },
  { id: 'b-r16-4', round: 'r16', roundLabel: 'Round of 16', homeId: null, awayId: null, position: 3, feedsFrom: ['b-r32-7', 'b-r32-8'] },

  // Quarter-Finals
  { id: 'b-qf-1', round: 'qf', roundLabel: 'Quarter-Final', homeId: null, awayId: null, position: 0, feedsFrom: ['b-r16-1', 'b-r16-2'] },
  { id: 'b-qf-2', round: 'qf', roundLabel: 'Quarter-Final', homeId: null, awayId: null, position: 1, feedsFrom: ['b-r16-3', 'b-r16-4'] },

  // Semi-Finals
  { id: 'b-sf-1', round: 'sf', roundLabel: 'Semi-Final', homeId: null, awayId: null, position: 0, feedsFrom: ['b-qf-1', 'b-qf-2'] },
  { id: 'b-sf-2', round: 'sf', roundLabel: 'Semi-Final', homeId: null, awayId: null, position: 1, feedsFrom: ['b-qf-1', 'b-qf-2'] },

  // Final - fix feedsFrom for sf
  { id: 'b-final', round: 'final', roundLabel: 'Final', homeId: null, awayId: null, position: 0, feedsFrom: ['b-sf-1', 'b-sf-2'] },
];

// Fix semi-finals - each SF gets one QF winner
const sf2 = INITIAL_BRACKET.find(m => m.id === 'b-sf-2');
if (sf2) {
  // SF1 and SF2 both feed from QF1 and QF2 - standard bracket
  INITIAL_BRACKET.find(m => m.id === 'b-sf-1')!.feedsFrom = ['b-qf-1'];
  sf2.feedsFrom = ['b-qf-2'];
}

export function propagateWinner(
  bracket: BracketMatch[],
  matchId: string,
  winnerId: string
): BracketMatch[] {
  const updated = bracket.map(m => ({ ...m }));

  const match = updated.find(m => m.id === matchId);
  if (!match) return updated;

  match.winnerId = winnerId;

  // Find child matches that feed from this match
  for (const child of updated) {
    if (!child.feedsFrom?.includes(matchId)) continue;

    const feedIndex = child.feedsFrom.indexOf(matchId);
    if (feedIndex === 0) {
      child.homeId = winnerId;
    } else {
      child.awayId = winnerId;
    }
  }

  return updated;
}

export function resetBracket(): BracketMatch[] {
  return INITIAL_BRACKET.map(m => ({
    ...m,
    winnerId: m.round === 'r32' ? undefined : null,
    homeId: m.round === 'r32' ? m.homeId : (m.feedsFrom ? null : m.homeId),
    awayId: m.round === 'r32' ? m.awayId : (m.feedsFrom ? null : m.awayId),
  }));
}
