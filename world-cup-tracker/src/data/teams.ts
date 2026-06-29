export interface Team {
  id: string;
  name: string;
  abbr: string;
  flag: string;
  color: string;
}

export const TEAMS: Record<string, Team> = {
  usa: { id: 'usa', name: 'United States', abbr: 'USA', flag: '🇺🇸', color: '#3C3B6E' },
  mex: { id: 'mex', name: 'Mexico', abbr: 'MEX', flag: '🇲🇽', color: '#006847' },
  can: { id: 'can', name: 'Canada', abbr: 'CAN', flag: '🇨🇦', color: '#FF0000' },
  bra: { id: 'bra', name: 'Brazil', abbr: 'BRA', flag: '🇧🇷', color: '#009C3B' },
  arg: { id: 'arg', name: 'Argentina', abbr: 'ARG', flag: '🇦🇷', color: '#74ACDF' },
  fra: { id: 'fra', name: 'France', abbr: 'FRA', flag: '🇫🇷', color: '#002395' },
  ger: { id: 'ger', name: 'Germany', abbr: 'GER', flag: '🇩🇪', color: '#000000' },
  esp: { id: 'esp', name: 'Spain', abbr: 'ESP', flag: '🇪🇸', color: '#AA151B' },
  eng: { id: 'eng', name: 'England', abbr: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#FFFFFF' },
  por: { id: 'por', name: 'Portugal', abbr: 'POR', flag: '🇵🇹', color: '#006600' },
  ned: { id: 'ned', name: 'Netherlands', abbr: 'NED', flag: '🇳🇱', color: '#FF6600' },
  bel: { id: 'bel', name: 'Belgium', abbr: 'BEL', flag: '🇧🇪', color: '#FDDA24' },
  cro: { id: 'cro', name: 'Croatia', abbr: 'CRO', flag: '🇭🇷', color: '#FF0000' },
  uru: { id: 'uru', name: 'Uruguay', abbr: 'URU', flag: '🇺🇾', color: '#0038A8' },
  col: { id: 'col', name: 'Colombia', abbr: 'COL', flag: '🇨🇴', color: '#FCD116' },
  jpn: { id: 'jpn', name: 'Japan', abbr: 'JPN', flag: '🇯🇵', color: '#BC002D' },
  kor: { id: 'kor', name: 'South Korea', abbr: 'KOR', flag: '🇰🇷', color: '#003478' },
  mar: { id: 'mar', name: 'Morocco', abbr: 'MAR', flag: '🇲🇦', color: '#C1272D' },
  sen: { id: 'sen', name: 'Senegal', abbr: 'SEN', flag: '🇸🇳', color: '#00853F' },
  aus: { id: 'aus', name: 'Australia', abbr: 'AUS', flag: '🇦🇺', color: '#FFCD00' },
  ecu: { id: 'ecu', name: 'Ecuador', abbr: 'ECU', flag: '🇪🇨', color: '#FFD100' },
  irn: { id: 'irn', name: 'Iran', abbr: 'IRN', flag: '🇮🇷', color: '#239F40' },
  sui: { id: 'sui', name: 'Switzerland', abbr: 'SUI', flag: '🇨🇭', color: '#FF0000' },
  pol: { id: 'pol', name: 'Poland', abbr: 'POL', flag: '🇵🇱', color: '#DC143C' },
  den: { id: 'den', name: 'Denmark', abbr: 'DEN', flag: '🇩🇰', color: '#C60C30' },
  ukr: { id: 'ukr', name: 'Ukraine', abbr: 'UKR', flag: '🇺🇦', color: '#005BBB' },
  sco: { id: 'sco', name: 'Scotland', abbr: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', color: '#0065BD' },
  tur: { id: 'tur', name: 'Turkey', abbr: 'TUR', flag: '🇹🇷', color: '#E30A17' },
  ngr: { id: 'ngr', name: 'Nigeria', abbr: 'NGR', flag: '🇳🇬', color: '#008751' },
  crc: { id: 'crc', name: 'Costa Rica', abbr: 'CRC', flag: '🇨🇷', color: '#002B7F' },
  per: { id: 'per', name: 'Peru', abbr: 'PER', flag: '🇵🇪', color: '#D91023' },
  chi: { id: 'chi', name: 'Chile', abbr: 'CHI', flag: '🇨🇱', color: '#D52B1E' },
};

export function getTeam(id: string): Team {
  return TEAMS[id] ?? { id, name: id.toUpperCase(), abbr: id.toUpperCase(), flag: '🏳️', color: '#666' };
}
