export interface Team {
  id: string;
  name: string;
  abbr: string;
  flag: string;
  color: string;
}

const TEAM_REGISTRY: Record<string, Omit<Team, 'id'>> = {
  'Mexico': { name: 'Mexico', abbr: 'MEX', flag: '🇲🇽', color: '#006847' },
  'South Africa': { name: 'South Africa', abbr: 'RSA', flag: '🇿🇦', color: '#007A4D' },
  'South Korea': { name: 'South Korea', abbr: 'KOR', flag: '🇰🇷', color: '#003478' },
  'Czech Republic': { name: 'Czech Republic', abbr: 'CZE', flag: '🇨🇿', color: '#11457E' },
  'Canada': { name: 'Canada', abbr: 'CAN', flag: '🇨🇦', color: '#FF0000' },
  'Bosnia & Herzegovina': { name: 'Bosnia & Herzegovina', abbr: 'BIH', flag: '🇧🇦', color: '#002395' },
  'Qatar': { name: 'Qatar', abbr: 'QAT', flag: '🇶🇦', color: '#8D1B3D' },
  'Switzerland': { name: 'Switzerland', abbr: 'SUI', flag: '🇨🇭', color: '#FF0000' },
  'Brazil': { name: 'Brazil', abbr: 'BRA', flag: '🇧🇷', color: '#009C3B' },
  'Morocco': { name: 'Morocco', abbr: 'MAR', flag: '🇲🇦', color: '#C1272D' },
  'Haiti': { name: 'Haiti', abbr: 'HAI', flag: '🇭🇹', color: '#00209F' },
  'Scotland': { name: 'Scotland', abbr: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', color: '#0065BD' },
  'USA': { name: 'United States', abbr: 'USA', flag: '🇺🇸', color: '#3C3B6E' },
  'Paraguay': { name: 'Paraguay', abbr: 'PAR', flag: '🇵🇾', color: '#D52B1E' },
  'Australia': { name: 'Australia', abbr: 'AUS', flag: '🇦🇺', color: '#FFCD00' },
  'Turkey': { name: 'Turkey', abbr: 'TUR', flag: '🇹🇷', color: '#E30A17' },
  'Germany': { name: 'Germany', abbr: 'GER', flag: '🇩🇪', color: '#000000' },
  'Curaçao': { name: 'Curaçao', abbr: 'CUW', flag: '🇨🇼', color: '#002B7F' },
  'Ivory Coast': { name: 'Ivory Coast', abbr: 'CIV', flag: '🇨🇮', color: '#F77F00' },
  'Ecuador': { name: 'Ecuador', abbr: 'ECU', flag: '🇪🇨', color: '#FFD100' },
  'Netherlands': { name: 'Netherlands', abbr: 'NED', flag: '🇳🇱', color: '#FF6600' },
  'Japan': { name: 'Japan', abbr: 'JPN', flag: '🇯🇵', color: '#BC002D' },
  'Sweden': { name: 'Sweden', abbr: 'SWE', flag: '🇸🇪', color: '#006AA7' },
  'Tunisia': { name: 'Tunisia', abbr: 'TUN', flag: '🇹🇳', color: '#E70013' },
  'Belgium': { name: 'Belgium', abbr: 'BEL', flag: '🇧🇪', color: '#FDDA24' },
  'Egypt': { name: 'Egypt', abbr: 'EGY', flag: '🇪🇬', color: '#CE1126' },
  'Iran': { name: 'Iran', abbr: 'IRN', flag: '🇮🇷', color: '#239F40' },
  'New Zealand': { name: 'New Zealand', abbr: 'NZL', flag: '🇳🇿', color: '#00247D' },
  'Spain': { name: 'Spain', abbr: 'ESP', flag: '🇪🇸', color: '#AA151B' },
  'Cape Verde': { name: 'Cape Verde', abbr: 'CPV', flag: '🇨🇻', color: '#003893' },
  'Saudi Arabia': { name: 'Saudi Arabia', abbr: 'KSA', flag: '🇸🇦', color: '#006C35' },
  'Uruguay': { name: 'Uruguay', abbr: 'URU', flag: '🇺🇾', color: '#0038A8' },
  'France': { name: 'France', abbr: 'FRA', flag: '🇫🇷', color: '#002395' },
  'Senegal': { name: 'Senegal', abbr: 'SEN', flag: '🇸🇳', color: '#00853F' },
  'Iraq': { name: 'Iraq', abbr: 'IRQ', flag: '🇮🇶', color: '#CE1126' },
  'Norway': { name: 'Norway', abbr: 'NOR', flag: '🇳🇴', color: '#BA0C2F' },
  'Argentina': { name: 'Argentina', abbr: 'ARG', flag: '🇦🇷', color: '#74ACDF' },
  'Algeria': { name: 'Algeria', abbr: 'ALG', flag: '🇩🇿', color: '#006233' },
  'Austria': { name: 'Austria', abbr: 'AUT', flag: '🇦🇹', color: '#ED2939' },
  'Jordan': { name: 'Jordan', abbr: 'JOR', flag: '🇯🇴', color: '#007A3D' },
  'Portugal': { name: 'Portugal', abbr: 'POR', flag: '🇵🇹', color: '#006600' },
  'DR Congo': { name: 'DR Congo', abbr: 'COD', flag: '🇨🇩', color: '#007FFF' },
  'Uzbekistan': { name: 'Uzbekistan', abbr: 'UZB', flag: '🇺🇿', color: '#1EB53A' },
  'Colombia': { name: 'Colombia', abbr: 'COL', flag: '🇨🇴', color: '#FCD116' },
  'England': { name: 'England', abbr: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#FFFFFF' },
  'Croatia': { name: 'Croatia', abbr: 'CRO', flag: '🇭🇷', color: '#FF0000' },
  'Ghana': { name: 'Ghana', abbr: 'GHA', flag: '🇬🇭', color: '#006B3F' },
  'Panama': { name: 'Panama', abbr: 'PAN', flag: '🇵🇦', color: '#DA121A' },
};

const nameToId = new Map<string, string>();

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

for (const name of Object.keys(TEAM_REGISTRY)) {
  nameToId.set(name, slugify(name));
}

const dynamicTeams: Record<string, Team> = {};

export function registerTeam(name: string): string {
  const id = slugify(name);
  if (!dynamicTeams[id]) {
    const known = TEAM_REGISTRY[name];
    dynamicTeams[id] = known
      ? { id, ...known }
      : { id, name, abbr: name.slice(0, 3).toUpperCase(), flag: '🏳️', color: '#666' };
  }
  return id;
}

export function getTeam(id: string): Team {
  if (dynamicTeams[id]) return dynamicTeams[id];
  return { id, name: id.replace(/-/g, ' '), abbr: id.slice(0, 3).toUpperCase(), flag: '🏳️', color: '#666' };
}

export function getTeamByName(name: string): Team {
  const id = registerTeam(name);
  return getTeam(id);
}

export function getTeamId(name: string): string {
  return registerTeam(name);
}
