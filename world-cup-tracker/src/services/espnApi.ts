import type { MatchStatus } from '../data/matches';

const ESPN_SCOREBOARD =
  'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';

export interface EspnLiveMatch {
  homeName: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  minute?: number;
  displayClock?: string;
  venue?: string;
  city?: string;
  date: string;
}

interface EspnCompetitor {
  homeAway: 'home' | 'away';
  score?: string;
  team?: { displayName?: string; shortDisplayName?: string };
}

interface EspnEvent {
  date: string;
  competitions?: Array<{
    status?: {
      displayClock?: string;
      period?: number;
      type?: {
        state?: string;
        name?: string;
        detail?: string;
      };
    };
    venue?: { fullName?: string; address?: { city?: string } };
    competitors?: EspnCompetitor[];
  }>;
}

interface EspnScoreboard {
  events?: EspnEvent[];
}

const TEAM_ALIASES: Record<string, string> = {
  'cote d ivoire': 'ivory coast',
  'côte d\'ivoire': 'ivory coast',
  'czechia': 'czech republic',
  'curacao': 'curaçao',
  'dr congo': 'dr congo',
  'democratic republic of the congo': 'dr congo',
  'korea republic': 'south korea',
  'usa': 'usa',
  'united states': 'usa',
};

export function normalizeTeamName(name: string): string {
  const lower = name.toLowerCase().trim();
  return TEAM_ALIASES[lower] ?? lower;
}

export function matchKey(team1: string, team2: string): string {
  return [normalizeTeamName(team1), normalizeTeamName(team2)].sort().join('|');
}

function parseMinute(displayClock?: string, detail?: string): number | undefined {
  const src = displayClock ?? detail ?? '';
  const m = src.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : undefined;
}

function mapEspnStatus(
  state?: string,
  statusName?: string,
  period?: number
): MatchStatus {
  if (state === 'post') return 'finished';
  if (state === 'pre') return 'scheduled';
  if (statusName?.includes('HALFTIME') || statusName === 'STATUS_HALFTIME') return 'halftime';
  if (state === 'in') {
    if (period === 0) return 'halftime';
    return 'live';
  }
  return 'scheduled';
}

function parseEspnEvent(event: EspnEvent): EspnLiveMatch | null {
  const comp = event.competitions?.[0];
  if (!comp?.competitors?.length) return null;

  const home = comp.competitors.find(c => c.homeAway === 'home');
  const away = comp.competitors.find(c => c.homeAway === 'away');
  if (!home?.team?.displayName || !away?.team?.displayName) return null;

  const statusType = comp.status?.type;
  const status = mapEspnStatus(statusType?.state, statusType?.name, comp.status?.period);

  return {
    homeName: home.team.displayName,
    awayName: away.team.displayName,
    homeScore: parseInt(home.score ?? '0', 10),
    awayScore: parseInt(away.score ?? '0', 10),
    status,
    minute: parseMinute(comp.status?.displayClock, statusType?.detail),
    displayClock: comp.status?.displayClock ?? statusType?.detail,
    venue: comp.venue?.fullName,
    city: comp.venue?.address?.city?.split(',')[0],
    date: event.date.slice(0, 10),
  };
}

function todayYmd(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
}

function yesterdayYmd(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
}

async function fetchScoreboardForDate(date: string): Promise<EspnLiveMatch[]> {
  const res = await fetch(`${ESPN_SCOREBOARD}?dates=${date}`, { cache: 'no-store' });
  if (!res.ok) return [];

  const data: EspnScoreboard = await res.json();
  return (data.events ?? [])
    .map(parseEspnEvent)
    .filter((m): m is EspnLiveMatch => m !== null);
}

export async function fetchEspnLiveScores(): Promise<Map<string, EspnLiveMatch>> {
  const dates = [todayYmd(), yesterdayYmd()];
  const results = await Promise.all(dates.map(fetchScoreboardForDate));

  const map = new Map<string, EspnLiveMatch>();
  for (const batch of results) {
    for (const match of batch) {
      map.set(matchKey(match.homeName, match.awayName), match);
    }
  }
  return map;
}
