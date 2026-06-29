export type MatchStatus = 'scheduled' | 'live' | 'halftime' | 'finished';

export interface Match {
  id: string;
  homeId: string;
  awayId: string;
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

export const GROUPS: Record<string, string[]> = {
  A: ['usa', 'mex', 'col', 'sen'],
  B: ['can', 'fra', 'aus', 'per'],
  C: ['bra', 'cro', 'jpn', 'mor'],
  D: ['arg', 'pol', 'ecu', 'sau'],
  E: ['ger', 'kor', 'crc', 'ukr'],
  F: ['esp', 'bel', 'tur', 'chi'],
  G: ['eng', 'den', 'irn', 'ngr'],
  H: ['por', 'uru', 'sui', 'gha'],
};

// Fix group D - sau doesn't exist, use sco
GROUPS.D = ['arg', 'pol', 'ecu', 'sco'];
GROUPS.C[3] = 'mar';
GROUPS.H[3] = 'crc';

export const MATCHES: Match[] = [
  // Group Stage - Recent & Live
  { id: 'm1', homeId: 'usa', awayId: 'mex', homeScore: 2, awayScore: 1, status: 'finished', stage: 'Group Stage', group: 'A', venue: 'MetLife Stadium', city: 'New York', date: '2026-06-11', time: '20:00' },
  { id: 'm2', homeId: 'bra', awayId: 'cro', homeScore: 1, awayScore: 1, status: 'finished', stage: 'Group Stage', group: 'C', venue: 'SoFi Stadium', city: 'Los Angeles', date: '2026-06-12', time: '17:00' },
  { id: 'm3', homeId: 'arg', awayId: 'pol', homeScore: 3, awayScore: 0, status: 'finished', stage: 'Group Stage', group: 'D', venue: 'Hard Rock Stadium', city: 'Miami', date: '2026-06-13', time: '20:00' },
  { id: 'm4', homeId: 'fra', awayId: 'aus', homeScore: 2, awayScore: 0, status: 'finished', stage: 'Group Stage', group: 'B', venue: 'BC Place', city: 'Vancouver', date: '2026-06-14', time: '14:00' },
  { id: 'm5', homeId: 'ger', awayId: 'kor', homeScore: 1, awayScore: 2, status: 'finished', stage: 'Group Stage', group: 'E', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', date: '2026-06-15', time: '17:00' },
  { id: 'm6', homeId: 'esp', awayId: 'bel', homeScore: 0, awayScore: 0, status: 'finished', stage: 'Group Stage', group: 'F', venue: 'AT&T Stadium', city: 'Dallas', date: '2026-06-16', time: '20:00' },
  { id: 'm7', homeId: 'eng', awayId: 'den', homeScore: 2, awayScore: 1, status: 'finished', stage: 'Group Stage', group: 'G', venue: 'Lincoln Financial Field', city: 'Philadelphia', date: '2026-06-17', time: '14:00' },
  { id: 'm8', homeId: 'por', awayId: 'uru', homeScore: 1, awayScore: 3, status: 'finished', stage: 'Group Stage', group: 'H', venue: 'Estadio Azteca', city: 'Mexico City', date: '2026-06-18', time: '20:00' },

  // Round 2 group games
  { id: 'm9', homeId: 'usa', awayId: 'col', homeScore: 1, awayScore: 1, status: 'finished', stage: 'Group Stage', group: 'A', venue: 'Levi\'s Stadium', city: 'San Francisco', date: '2026-06-20', time: '17:00' },
  { id: 'm10', homeId: 'mex', awayId: 'sen', homeScore: 2, awayScore: 0, status: 'finished', stage: 'Group Stage', group: 'A', venue: 'NRG Stadium', city: 'Houston', date: '2026-06-21', time: '20:00' },
  { id: 'm11', homeId: 'bra', awayId: 'jpn', homeScore: 4, awayScore: 1, status: 'finished', stage: 'Group Stage', group: 'C', venue: 'SoFi Stadium', city: 'Los Angeles', date: '2026-06-22', time: '14:00' },
  { id: 'm12', homeId: 'arg', awayId: 'ecu', homeScore: 2, awayScore: 0, status: 'finished', stage: 'Group Stage', group: 'D', venue: 'Arrowhead Stadium', city: 'Kansas City', date: '2026-06-23', time: '17:00' },
  { id: 'm13', homeId: 'fra', awayId: 'can', homeScore: 3, awayScore: 1, status: 'finished', stage: 'Group Stage', group: 'B', venue: 'BMO Field', city: 'Toronto', date: '2026-06-24', time: '20:00' },
  { id: 'm14', homeId: 'ger', awayId: 'ukr', homeScore: 2, awayScore: 2, status: 'finished', stage: 'Group Stage', group: 'E', venue: 'Gillette Stadium', city: 'Boston', date: '2026-06-25', time: '14:00' },
  { id: 'm15', homeId: 'esp', awayId: 'tur', homeScore: 3, awayScore: 0, status: 'finished', stage: 'Group Stage', group: 'F', venue: 'Lumen Field', city: 'Seattle', date: '2026-06-26', time: '17:00' },
  { id: 'm16', homeId: 'eng', awayId: 'irn', homeScore: 1, awayScore: 0, status: 'finished', stage: 'Group Stage', group: 'G', venue: 'Soldier Field', city: 'Chicago', date: '2026-06-27', time: '20:00' },

  // LIVE matches (today - June 29)
  { id: 'm17', homeId: 'usa', awayId: 'sen', homeScore: 2, awayScore: 1, status: 'live', minute: 67, stage: 'Group Stage', group: 'A', venue: 'MetLife Stadium', city: 'New York', date: '2026-06-29', time: '18:00' },
  { id: 'm18', homeId: 'bra', awayId: 'mar', homeScore: 1, awayScore: 1, status: 'live', minute: 34, stage: 'Group Stage', group: 'C', venue: 'SoFi Stadium', city: 'Los Angeles', date: '2026-06-29', time: '20:30' },
  { id: 'm19', homeId: 'arg', awayId: 'sco', homeScore: 0, awayScore: 0, status: 'halftime', minute: 45, stage: 'Group Stage', group: 'D', venue: 'Hard Rock Stadium', city: 'Miami', date: '2026-06-29', time: '17:00' },

  // Upcoming
  { id: 'm20', homeId: 'fra', awayId: 'per', homeScore: 0, awayScore: 0, status: 'scheduled', stage: 'Group Stage', group: 'B', venue: 'BC Place', city: 'Vancouver', date: '2026-06-30', time: '14:00' },
  { id: 'm21', homeId: 'ger', awayId: 'crc', homeScore: 0, awayScore: 0, status: 'scheduled', stage: 'Group Stage', group: 'E', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', date: '2026-06-30', time: '17:00' },
  { id: 'm22', homeId: 'esp', awayId: 'chi', homeScore: 0, awayScore: 0, status: 'scheduled', stage: 'Group Stage', group: 'F', venue: 'AT&T Stadium', city: 'Dallas', date: '2026-06-30', time: '20:00' },
  { id: 'm23', homeId: 'eng', awayId: 'ngr', homeScore: 0, awayScore: 0, status: 'scheduled', stage: 'Group Stage', group: 'G', venue: 'Lincoln Financial Field', city: 'Philadelphia', date: '2026-07-01', time: '14:00' },
  { id: 'm24', homeId: 'por', awayId: 'crc', homeScore: 0, awayScore: 0, status: 'scheduled', stage: 'Group Stage', group: 'H', venue: 'Estadio Azteca', city: 'Mexico City', date: '2026-07-01', time: '17:00' },

  // Knockout - some completed, some upcoming
  { id: 'k1', homeId: 'usa', awayId: 'kor', homeScore: 0, awayScore: 0, status: 'scheduled', stage: 'Round of 32', venue: 'MetLife Stadium', city: 'New York', date: '2026-07-04', time: '17:00' },
  { id: 'k2', homeId: 'bra', awayId: 'uru', homeScore: 0, awayScore: 0, status: 'scheduled', stage: 'Round of 32', venue: 'SoFi Stadium', city: 'Los Angeles', date: '2026-07-04', time: '20:00' },
  { id: 'k3', homeId: 'arg', awayId: 'mex', homeScore: 0, awayScore: 0, status: 'scheduled', stage: 'Round of 32', venue: 'NRG Stadium', city: 'Houston', date: '2026-07-05', time: '14:00' },
  { id: 'k4', homeId: 'fra', awayId: 'eng', homeScore: 0, awayScore: 0, status: 'scheduled', stage: 'Round of 32', venue: 'AT&T Stadium', city: 'Dallas', date: '2026-07-05', time: '17:00' },
  { id: 'k5', homeId: 'ger', awayId: 'esp', homeScore: 0, awayScore: 0, status: 'scheduled', stage: 'Round of 16', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', date: '2026-07-08', time: '20:00' },
  { id: 'k6', homeId: 'ned', awayId: 'bel', homeScore: 0, awayScore: 0, status: 'scheduled', stage: 'Round of 16', venue: 'Hard Rock Stadium', city: 'Miami', date: '2026-07-09', time: '17:00' },
  { id: 'k7', homeId: 'tbd1', awayId: 'tbd2', homeScore: 0, awayScore: 0, status: 'scheduled', stage: 'Quarter-Final', venue: 'MetLife Stadium', city: 'New York', date: '2026-07-12', time: '20:00' },
  { id: 'k8', homeId: 'tbd3', awayId: 'tbd4', homeScore: 0, awayScore: 0, status: 'scheduled', stage: 'Quarter-Final', venue: 'SoFi Stadium', city: 'Los Angeles', date: '2026-07-13', time: '20:00' },
  { id: 'k9', homeId: 'tbd5', awayId: 'tbd6', homeScore: 0, awayScore: 0, status: 'scheduled', stage: 'Semi-Final', venue: 'AT&T Stadium', city: 'Dallas', date: '2026-07-16', time: '20:00' },
  { id: 'k10', homeId: 'tbd7', awayId: 'tbd8', homeScore: 0, awayScore: 0, status: 'scheduled', stage: 'Semi-Final', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', date: '2026-07-17', time: '20:00' },
  { id: 'k11', homeId: 'tbd9', awayId: 'tbd10', homeScore: 0, awayScore: 0, status: 'scheduled', stage: 'Final', venue: 'MetLife Stadium', city: 'New York', date: '2026-07-19', time: '18:00' },
];

export const GROUP_STANDINGS: Record<string, GroupStanding[]> = {
  A: [
    { teamId: 'usa', played: 2, won: 1, drawn: 1, lost: 0, gf: 3, ga: 2, gd: 1, pts: 4 },
    { teamId: 'mex', played: 2, won: 1, drawn: 0, lost: 1, gf: 3, ga: 3, gd: 0, pts: 3 },
    { teamId: 'col', played: 2, won: 0, drawn: 2, lost: 0, gf: 2, ga: 2, gd: 0, pts: 2 },
    { teamId: 'sen', played: 2, won: 0, drawn: 0, lost: 2, gf: 1, ga: 4, gd: -3, pts: 0 },
  ],
  B: [
    { teamId: 'fra', played: 2, won: 2, drawn: 0, lost: 0, gf: 5, ga: 1, gd: 4, pts: 6 },
    { teamId: 'can', played: 2, won: 1, drawn: 0, lost: 1, gf: 2, ga: 4, gd: -2, pts: 3 },
    { teamId: 'aus', played: 2, won: 0, drawn: 1, lost: 1, gf: 1, ga: 2, gd: -1, pts: 1 },
    { teamId: 'per', played: 2, won: 0, drawn: 1, lost: 1, gf: 1, ga: 2, gd: -1, pts: 1 },
  ],
  C: [
    { teamId: 'bra', played: 2, won: 1, drawn: 1, lost: 0, gf: 5, ga: 2, gd: 3, pts: 4 },
    { teamId: 'cro', played: 2, won: 1, drawn: 1, lost: 0, gf: 3, ga: 2, gd: 1, pts: 4 },
    { teamId: 'jpn', played: 2, won: 0, drawn: 0, lost: 2, gf: 2, ga: 5, gd: -3, pts: 0 },
    { teamId: 'mar', played: 1, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
  ],
  D: [
    { teamId: 'arg', played: 2, won: 2, drawn: 0, lost: 0, gf: 5, ga: 0, gd: 5, pts: 6 },
    { teamId: 'pol', played: 2, won: 0, drawn: 1, lost: 1, gf: 1, ga: 3, gd: -2, pts: 1 },
    { teamId: 'ecu', played: 2, won: 0, drawn: 1, lost: 1, gf: 1, ga: 2, gd: -1, pts: 1 },
    { teamId: 'sco', played: 1, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
  ],
  E: [
    { teamId: 'kor', played: 2, won: 1, drawn: 1, lost: 0, gf: 3, ga: 2, gd: 1, pts: 4 },
    { teamId: 'ger', played: 2, won: 0, drawn: 2, lost: 0, gf: 3, ga: 3, gd: 0, pts: 2 },
    { teamId: 'ukr', played: 2, won: 0, drawn: 2, lost: 0, gf: 2, ga: 2, gd: 0, pts: 2 },
    { teamId: 'crc', played: 1, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
  ],
  F: [
    { teamId: 'esp', played: 2, won: 1, drawn: 1, lost: 0, gf: 3, ga: 0, gd: 3, pts: 4 },
    { teamId: 'bel', played: 2, won: 0, drawn: 2, lost: 0, gf: 1, ga: 1, gd: 0, pts: 2 },
    { teamId: 'tur', played: 2, won: 0, drawn: 0, lost: 2, gf: 0, ga: 3, gd: -3, pts: 0 },
    { teamId: 'chi', played: 1, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
  ],
  G: [
    { teamId: 'eng', played: 2, won: 2, drawn: 0, lost: 0, gf: 3, ga: 1, gd: 2, pts: 6 },
    { teamId: 'den', played: 2, won: 0, drawn: 0, lost: 2, gf: 2, ga: 3, gd: -1, pts: 0 },
    { teamId: 'irn', played: 2, won: 0, drawn: 0, lost: 2, gf: 0, ga: 2, gd: -2, pts: 0 },
    { teamId: 'ngr', played: 1, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
  ],
  H: [
    { teamId: 'uru', played: 2, won: 2, drawn: 0, lost: 0, gf: 5, ga: 1, gd: 4, pts: 6 },
    { teamId: 'por', played: 2, won: 0, drawn: 0, lost: 2, gf: 2, ga: 5, gd: -3, pts: 0 },
    { teamId: 'sui', played: 1, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { teamId: 'crc', played: 1, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
  ],
};

export function formatMatchDate(date: string): string {
  const d = new Date(date + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
