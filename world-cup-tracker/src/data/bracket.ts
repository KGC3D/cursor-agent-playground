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

export function propagateWinner(
  bracket: BracketMatch[],
  matchId: string,
  winnerId: string
): BracketMatch[] {
  const updated = bracket.map(m => ({ ...m }));

  const match = updated.find(m => m.id === matchId);
  if (!match) return updated;

  match.winnerId = winnerId;

  const roundOrder = ['r32', 'r16', 'qf', 'sf', 'final'] as const;
  const roundIdx = roundOrder.indexOf(match.round);

  if (roundIdx < 0 || roundIdx >= roundOrder.length - 1) return updated;

  const nextRound = roundOrder[roundIdx + 1];
  const sameRound = updated.filter(m => m.round === match.round);
  const posInRound = sameRound.indexOf(match);
  const nextRoundMatches = updated.filter(m => m.round === nextRound);
  const nextMatchIdx = Math.floor(posInRound / 2);

  if (nextMatchIdx < nextRoundMatches.length) {
    const nextMatch = nextRoundMatches[nextMatchIdx];
    if (posInRound % 2 === 0) {
      nextMatch.homeId = winnerId;
    } else {
      nextMatch.awayId = winnerId;
    }
  }

  return updated;
}

export function resetBracket(source: BracketMatch[]): BracketMatch[] {
  const reset = source.map(m => ({
    ...m,
    winnerId: undefined as string | null | undefined,
    homeId: m.round === 'r32' ? m.homeId : (m.homeLabel ? null : m.homeId),
    awayId: m.round === 'r32' ? m.awayId : (m.awayLabel ? null : m.awayId),
  }));

  // Restore r32 from source
  for (const m of source) {
    if (m.round === 'r32') {
      const target = reset.find(r => r.id === m.id);
      if (target) {
        target.homeId = m.homeId;
        target.awayId = m.awayId;
        target.winnerId = m.winnerId;
      }
    }
  }

  return reset;
}
