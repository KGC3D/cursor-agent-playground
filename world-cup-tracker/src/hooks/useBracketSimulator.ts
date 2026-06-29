import { useState, useCallback, useEffect } from 'react';
import { propagateWinner, resetBracket, type BracketMatch } from '../data/bracket';

export function useBracketSimulator(liveBracket: BracketMatch[]) {
  const [simBracket, setSimBracket] = useState<BracketMatch[]>([]);
  const [simMode, setSimMode] = useState(false);

  useEffect(() => {
    if (!simMode) return;
    setSimBracket(liveBracket.map(m => ({ ...m, winnerId: m.winnerId ?? undefined })));
  }, [liveBracket, simMode]);

  const pickWinner = useCallback((matchId: string, winnerId: string) => {
    setSimBracket(prev => propagateWinner(prev, matchId, winnerId));
  }, []);

  const reset = useCallback(() => {
    setSimBracket(resetBracket(liveBracket));
  }, [liveBracket]);

  const bracket = simMode ? simBracket : liveBracket;

  return { bracket, simMode, setSimMode, pickWinner, reset };
}
