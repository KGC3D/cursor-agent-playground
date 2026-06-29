import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Match, GroupStanding } from '../data/matches';
import { todayIso } from '../data/matches';
import type { BracketMatch } from '../data/bracket';
import { fetchWorldCupData } from '../services/worldCupApi';
import {
  detectCurrentPhase,
  activeLiveMatches,
  currentPhaseResults,
  todayInPhase,
  upcomingByPhase,
  groupByPhase,
  PHASE_LABELS,
  type TournamentPhase,
  type PhaseSection,
} from '../utils/tournamentPhases';

const POLL_INTERVAL = 30_000;

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

  const currentPhase = useMemo(
    () => detectCurrentPhase(matches),
    [matches]
  );

  const currentPhaseLabel = PHASE_LABELS[currentPhase];

  const liveMatches = useMemo(
    () => activeLiveMatches(matches, currentPhase),
    [matches, currentPhase]
  );

  const todayMatches = useMemo(
    () => todayInPhase(matches, today, currentPhase),
    [matches, today, currentPhase]
  );

  const phaseResults = useMemo(
    () => currentPhaseResults(matches, currentPhase),
    [matches, currentPhase]
  );

  const scheduleSections = useMemo(
    () => upcomingByPhase(matches, currentPhase),
    [matches, currentPhase]
  );

  const allScheduleSections = useMemo(
    () => groupByPhase(matches.filter(m => m.status === 'scheduled')),
    [matches]
  );

  const groupStageComplete = currentPhase !== 'group';

  return {
    matches,
    standings,
    liveBracket,
    liveMatches,
    todayMatches,
    phaseResults,
    scheduleSections,
    allScheduleSections,
    currentPhase,
    currentPhaseLabel,
    groupStageComplete,
    lastUpdated,
    loading,
    error,
    refresh,
  };
}

export type { TournamentPhase, PhaseSection };
