export type MatchStatus = 'scheduled' | 'live' | 'halftime' | 'finished';

export interface Match {
  id: string;
  homeId: string;
  awayId: string;
  homeName: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  minute?: number;
  stage: string;
  group?: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  kickoffUtc?: number;
}

export interface GroupStanding {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

export function formatMatchDate(date: string): string {
  const d = new Date(date + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatKickoffTime(time: string): string {
  const match = time.match(/(\d{1,2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : time;
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
