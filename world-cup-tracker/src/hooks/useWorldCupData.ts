import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Match, GroupStanding } from '../data/matches';
import { todayIso } from '../data/matches';
import type { BracketMatch } from '../data/bracket';
import { fetchWorldCupData } from '../services/worldCupApi';

const POLL_INTERVAL = 30_000; // refresh every 30s — ESPN live scores

export function useWorldCupData() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<Record<string, GroupStanding[]>>({});
  const [liveBracket, setLiveBracket] = useState<BracketMatch[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchWorldCupData();
      setMatches(data.matches);
      setStandings(data.standings);
      setLiveBracket(data.bracket);
      setLastUpdated(data.lastUpdated);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [refresh]);

  const today = todayIso();

  const liveMatches = useMemo(
    () => matches.filter(m => m.status === 'live' || m.status === 'halftime'),
    [matches]
  );

  const todayMatches = useMemo(
    () => matches.filter(m => m.date === today),
    [matches, today]
  );

  const upcomingMatches = useMemo(
    () => matches.filter(m => m.status === 'scheduled').sort((a, b) => (a.kickoffUtc ?? 0) - (b.kickoffUtc ?? 0)),
    [matches]
  );

  const finishedMatches = useMemo(
    () => matches.filter(m => m.status === 'finished'),
    [matches]
  );

  return {
    matches,
    standings,
    liveBracket,
    liveMatches,
    todayMatches,
    upcomingMatches,
    finishedMatches,
    lastUpdated,
    loading,
    error,
    refresh,
  };
}
