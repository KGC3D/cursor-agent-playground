import { useState, useEffect, useCallback } from 'react';
import { MATCHES, type Match } from '../data/matches';

export function useLiveScores() {
  const [matches, setMatches] = useState<Match[]>(MATCHES);

  const tick = useCallback(() => {
    setMatches(prev =>
      prev.map(m => {
        if (m.status !== 'live') return m;

        const newMinute = (m.minute ?? 0) + 1;
        let updated = { ...m, minute: newMinute };

        // Random goal chance after minute 20
        if (newMinute > 20 && Math.random() < 0.03) {
          const homeScores = Math.random() > 0.5;
          updated = {
            ...updated,
            homeScore: homeScores ? m.homeScore + 1 : m.homeScore,
            awayScore: !homeScores ? m.awayScore + 1 : m.awayScore,
          };
        }

        if (newMinute >= 90) {
          updated = { ...updated, status: 'finished' as const, minute: 90 };
        }

        return updated;
      })
    );
  }, []);

  useEffect(() => {
    const hasLive = matches.some(m => m.status === 'live');
    if (!hasLive) return;

    const interval = setInterval(tick, 8000);
    return () => clearInterval(interval);
  }, [matches, tick]);

  const liveMatches = matches.filter(m => m.status === 'live' || m.status === 'halftime');
  const todayMatches = matches.filter(m => m.date === '2026-06-29' || m.date === '2026-06-30');
  const upcomingMatches = matches.filter(m => m.status === 'scheduled');
  const finishedMatches = matches.filter(m => m.status === 'finished');

  return { matches, liveMatches, todayMatches, upcomingMatches, finishedMatches };
}
