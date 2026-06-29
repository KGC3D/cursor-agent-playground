import { useState, useCallback } from 'react';
import { INITIAL_BRACKET, propagateWinner, resetBracket, type BracketMatch } from '../data/bracket';

export function useBracketSimulator() {
  const [bracket, setBracket] = useState<BracketMatch[]>(
    () => INITIAL_BRACKET.map(m => ({ ...m }))
  );
  const [simMode, setSimMode] = useState(true);

  const pickWinner = useCallback((matchId: string, winnerId: string) => {
    setBracket(prev => propagateWinner(prev, matchId, winnerId));
  }, []);

  const reset = useCallback(() => {
    setBracket(resetBracket());
  }, []);

  const getMatchesByRound = useCallback(
    (round: BracketMatch['round']) => bracket.filter(m => m.round === round),
    [bracket]
  );

  return { bracket, simMode, setSimMode, pickWinner, reset, getMatchesByRound };
}
