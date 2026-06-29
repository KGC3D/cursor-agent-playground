import type { Match, MatchStatus, GroupStanding } from '../data/matches';
import { getTeamId } from '../data/teams';
import type { BracketMatch } from '../data/bracket';
import { fetchEspnLiveScores, matchKey, type EspnLiveMatch } from './espnApi';

const API_URL =
  'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json';

const MATCH_DURATION_MS = 105 * 60 * 1000; // 90 + stoppage

interface RawGoal {
  name: string;
  minute: string;
}

interface RawMatch {
  round: string;
  num?: number;
  date: string;
  time: string;
  team1: string;
  team2: string;
  score?: { ft?: [number, number]; ht?: [number, number] };
  goals1?: RawGoal[];
  goals2?: RawGoal[];
  group?: string;
  ground: string;
}

interface RawWorldCup {
  name: string;
  matches: RawMatch[];
}

function parseUtcOffset(timeStr: string): { hours: number; minutes: number; offsetHours: number } | null {
  const m = timeStr.match(/(\d{1,2}):(\d{2})\s*UTC([+-]?\d+)/);
  if (!m) return null;
  return { hours: parseInt(m[1], 10), minutes: parseInt(m[2], 10), offsetHours: parseInt(m[3], 10) };
}

export function parseKickoffUtc(date: string, time: string): number {
  const parsed = parseUtcOffset(time);
  if (!parsed) return new Date(`${date}T12:00:00Z`).getTime();

  const utcHours = parsed.hours - parsed.offsetHours;
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCHours(utcHours, parsed.minutes, 0, 0);
  return d.getTime();
}

function estimateMinute(kickoffUtc: number, now: number): number {
  const elapsed = Math.floor((now - kickoffUtc) / 60000);
  if (elapsed <= 45) return Math.max(1, elapsed);
  if (elapsed <= 60) return 45; // halftime break approximation
  return Math.min(90, elapsed - 15);
}

function resolveStatus(raw: RawMatch, now: number): MatchStatus {
  if (raw.score?.ft) return 'finished';

  const kickoff = parseKickoffUtc(raw.date, raw.time);
  if (now < kickoff) return 'scheduled';

  const elapsed = now - kickoff;
  if (elapsed > MATCH_DURATION_MS) {
    // Past match window with no score — treat as finished 0-0 or scheduled if placeholder
    if (raw.team1.startsWith('W') || raw.team2.startsWith('W')) return 'scheduled';
    return 'finished';
  }

  if (raw.score?.ht && !raw.score.ft) {
    const htEnd = kickoff + 60 * 60 * 1000;
    if (now >= htEnd - 15 * 60 * 1000 && now <= htEnd + 5 * 60 * 1000) return 'halftime';
  }

  return 'live';
}

function parseStage(raw: RawMatch): string {
  if (raw.group) return 'Group Stage';
  if (raw.round.startsWith('Round of 32')) return 'Round of 32';
  if (raw.round.startsWith('Round of 16')) return 'Round of 16';
  if (raw.round.startsWith('Quarter')) return 'Quarter-Final';
  if (raw.round.startsWith('Semi')) return 'Semi-Final';
  if (raw.round === 'Final') return 'Final';
  if (raw.round.includes('3rd')) return 'Third Place';
  return raw.round;
}

function parseGroup(raw: RawMatch): string | undefined {
  if (!raw.group) return undefined;
  const m = raw.group.match(/Group\s+([A-L])/i);
  return m ? m[1] : undefined;
}

function parseVenue(ground: string): { venue: string; city: string } {
  const parts = ground.split('(');
  if (parts.length >= 2) {
    const city = parts[parts.length - 1].replace(')', '').trim();
    const venue = parts.slice(0, -1).join('(').replace(/\/$/, '').trim();
    return { venue, city };
  }
  return { venue: ground, city: ground };
}

function rawToMatch(raw: RawMatch, index: number, now: number): Match {
  const homeId = getTeamId(raw.team1);
  const awayId = getTeamId(raw.team2);
  const status = resolveStatus(raw, now);
  const kickoffUtc = parseKickoffUtc(raw.date, raw.time);
  const { venue, city } = parseVenue(raw.ground);

  let homeScore = 0;
  let awayScore = 0;
  if (raw.score?.ft) {
    [homeScore, awayScore] = raw.score.ft;
  } else if (status === 'live' || status === 'halftime') {
    if (raw.score?.ht) {
      [homeScore, awayScore] = raw.score.ht;
    } else {
      // Derive live score from goal events when available
      const g1 = raw.goals1?.length ?? 0;
      const g2 = raw.goals2?.length ?? 0;
      if (g1 > 0 || g2 > 0) {
        homeScore = g1;
        awayScore = g2;
      }
    }
  }

  return {
    id: raw.num ? `m-${raw.num}` : `m-${index}`,
    homeId,
    awayId,
    homeName: raw.team1,
    awayName: raw.team2,
    homeScore,
    awayScore,
    status,
    minute: status === 'live' || status === 'halftime' ? estimateMinute(kickoffUtc, now) : undefined,
    stage: parseStage(raw),
    group: parseGroup(raw),
    venue,
    city,
    date: raw.date,
    time: raw.time,
    kickoffUtc,
  };
}

export function computeStandings(matches: Match[]): Record<string, GroupStanding[]> {
  const groups: Record<string, Map<string, GroupStanding>> = {};

  for (const m of matches) {
    if (!m.group || m.status !== 'finished') continue;

    if (!groups[m.group]) groups[m.group] = new Map();

    for (const teamId of [m.homeId, m.awayId]) {
      if (!groups[m.group].has(teamId)) {
        groups[m.group].set(teamId, {
          teamId, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0,
        });
      }
    }

    const home = groups[m.group].get(m.homeId)!;
    const away = groups[m.group].get(m.awayId)!;

    home.played++;
    away.played++;
    home.gf += m.homeScore;
    home.ga += m.awayScore;
    away.gf += m.awayScore;
    away.ga += m.homeScore;

    if (m.homeScore > m.awayScore) {
      home.won++; home.pts += 3;
      away.lost++;
    } else if (m.homeScore < m.awayScore) {
      away.won++; away.pts += 3;
      home.lost++;
    } else {
      home.drawn++; away.drawn++;
      home.pts++; away.pts++;
    }

    home.gd = home.gf - home.ga;
    away.gd = away.gf - away.ga;
  }

  const result: Record<string, GroupStanding[]> = {};
  for (const [group, teams] of Object.entries(groups)) {
    result[group] = [...teams.values()].sort((a, b) =>
      b.pts - a.pts || b.gd - a.gd || b.gf - a.gf
    );
  }

  return result;
}

const ROUND_MAP: Record<string, BracketMatch['round']> = {
  'Round of 32': 'r32',
  'Round of 16': 'r16',
  'Quarter-final': 'qf',
  'Quarter-finals': 'qf',
  'Semi-final': 'sf',
  'Semi-finals': 'sf',
  'Final': 'final',
};

function isPlaceholder(name: string): boolean {
  return /^W\d+$/i.test(name);
}

function resolveWinner(match: RawMatch): string | null {
  if (!match.score?.ft) return null;
  const [s1, s2] = match.score.ft;
  if (s1 > s2) return match.team1;
  if (s2 > s1) return match.team2;
  return null;
}

function resolveTeamName(name: string, matchByNum: Map<number, RawMatch>): string {
  if (!isPlaceholder(name)) return name;
  const num = parseInt(name.slice(1), 10);
  const src = matchByNum.get(num);
  if (!src) return name;
  const winner = resolveWinner(src);
  return winner ?? name;
}

export function buildLiveBracket(rawMatches: RawMatch[]): BracketMatch[] {
  const knockout = rawMatches.filter(r => !r.group);
  const matchByNum = new Map<number, RawMatch>();
  for (const m of knockout) {
    if (m.num) matchByNum.set(m.num, m);
  }

  const bracket: BracketMatch[] = [];
  const roundPositions: Record<string, number> = {};

  for (const raw of knockout) {
    const roundKey = ROUND_MAP[raw.round] ?? raw.round as BracketMatch['round'];
    if (!ROUND_MAP[raw.round] && raw.round !== 'Final') continue;

    const pos = roundPositions[roundKey] ?? 0;
    roundPositions[roundKey] = pos + 1;

    const homeName = resolveTeamName(raw.team1, matchByNum);
    const awayName = resolveTeamName(raw.team2, matchByNum);
    const homeId = isPlaceholder(homeName) ? null : getTeamId(homeName);
    const awayId = isPlaceholder(awayName) ? null : getTeamId(awayName);

    let winnerId: string | null = null;
    if (raw.score?.ft) {
      const [s1, s2] = raw.score.ft;
      if (s1 > s2 && homeId) winnerId = homeId;
      else if (s2 > s1 && awayId) winnerId = awayId;
    }

    bracket.push({
      id: `b-${raw.num ?? pos}`,
      round: roundKey,
      roundLabel: parseStage(raw),
      homeId,
      awayId,
      homeLabel: isPlaceholder(raw.team1) ? raw.team1 : undefined,
      awayLabel: isPlaceholder(raw.team2) ? raw.team2 : undefined,
      winnerId,
      position: pos,
    });
  }

  return bracket;
}

function applyEspnOverlay(matches: Match[], espn: Map<string, EspnLiveMatch>): Match[] {
  return matches.map(m => {
    const key = matchKey(m.homeName, m.awayName);
    const live = espn.get(key);
    if (!live) return m;

    // ESPN is authoritative for in-progress and same-day results
    const useEspn =
      live.status === 'live' ||
      live.status === 'halftime' ||
      (live.status === 'finished' && m.status !== 'finished') ||
      (m.status === 'live' || m.status === 'halftime');

    if (!useEspn) return m;

    return {
      ...m,
      homeScore: live.homeScore,
      awayScore: live.awayScore,
      status: live.status,
      minute: live.minute,
      clock: live.displayClock,
      venue: live.venue ?? m.venue,
      city: live.city ?? m.city,
    };
  });
}

export async function fetchWorldCupData(): Promise<{
  matches: Match[];
  standings: Record<string, GroupStanding[]>;
  bracket: BracketMatch[];
  lastUpdated: Date;
}> {
  const res = await fetch(API_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch World Cup data: ${res.status}`);

  const [data, espnLive] = await Promise.all([
    res.json() as Promise<RawWorldCup>,
    fetchEspnLiveScores().catch(() => new Map<string, EspnLiveMatch>()),
  ]);
  const now = Date.now();

  let matches = data.matches.map((raw, i) => rawToMatch(raw, i, now));
  matches = applyEspnOverlay(matches, espnLive);
  const standings = computeStandings(matches);
  const bracket = buildLiveBracket(data.matches);

  return { matches, standings, bracket, lastUpdated: new Date() };
}
