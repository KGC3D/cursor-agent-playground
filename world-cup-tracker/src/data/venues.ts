export interface VenueInfo {
  stadium: string;
  city: string;
  region?: string;
  country: string;
}

/** Official FIFA World Cup 2026 venue names mapped from openfootball ground strings */
export const VENUE_MAP: Record<string, VenueInfo> = {
  'Atlanta': {
    stadium: 'Atlanta Stadium',
    city: 'Atlanta',
    region: 'Georgia',
    country: 'USA',
  },
  'Boston (Foxborough)': {
    stadium: 'Boston Stadium',
    city: 'Foxborough',
    region: 'Massachusetts',
    country: 'USA',
  },
  'Dallas (Arlington)': {
    stadium: 'Dallas Stadium',
    city: 'Arlington',
    region: 'Texas',
    country: 'USA',
  },
  'Guadalajara (Zapopan)': {
    stadium: 'Guadalajara Stadium',
    city: 'Zapopan',
    region: 'Jalisco',
    country: 'Mexico',
  },
  'Houston': {
    stadium: 'Houston Stadium',
    city: 'Houston',
    region: 'Texas',
    country: 'USA',
  },
  'Kansas City': {
    stadium: 'Kansas City Stadium',
    city: 'Kansas City',
    region: 'Missouri',
    country: 'USA',
  },
  'Los Angeles (Inglewood)': {
    stadium: 'Los Angeles Stadium',
    city: 'Inglewood',
    region: 'California',
    country: 'USA',
  },
  'Mexico City': {
    stadium: 'Mexico City Stadium',
    city: 'Mexico City',
    country: 'Mexico',
  },
  'Miami (Miami Gardens)': {
    stadium: 'Miami Stadium',
    city: 'Miami Gardens',
    region: 'Florida',
    country: 'USA',
  },
  'Monterrey (Guadalupe)': {
    stadium: 'Monterrey Stadium',
    city: 'Guadalupe',
    region: 'Nuevo León',
    country: 'Mexico',
  },
  'New York/New Jersey (East Rutherford)': {
    stadium: 'New York New Jersey Stadium',
    city: 'East Rutherford',
    region: 'New Jersey',
    country: 'USA',
  },
  'Philadelphia': {
    stadium: 'Philadelphia Stadium',
    city: 'Philadelphia',
    region: 'Pennsylvania',
    country: 'USA',
  },
  'San Francisco Bay Area (Santa Clara)': {
    stadium: 'San Francisco Bay Area Stadium',
    city: 'Santa Clara',
    region: 'California',
    country: 'USA',
  },
  'Seattle': {
    stadium: 'Seattle Stadium',
    city: 'Seattle',
    region: 'Washington',
    country: 'USA',
  },
  'Toronto': {
    stadium: 'Toronto Stadium',
    city: 'Toronto',
    region: 'Ontario',
    country: 'Canada',
  },
  'Vancouver': {
    stadium: 'BC Place Vancouver',
    city: 'Vancouver',
    region: 'British Columbia',
    country: 'Canada',
  },
};

export function resolveVenue(ground: string): VenueInfo {
  if (VENUE_MAP[ground]) return VENUE_MAP[ground];

  // Fallback parse "City (Suburb)" format
  const parts = ground.split('(');
  if (parts.length >= 2) {
    const city = parts[parts.length - 1].replace(')', '').trim();
    const area = parts.slice(0, -1).join('(').replace(/\/$/, '').trim();
    return {
      stadium: `${area} Stadium`,
      city,
      country: 'USA',
    };
  }

  return {
    stadium: `${ground} Stadium`,
    city: ground,
    country: 'USA',
  };
}

export function formatVenueLine(venue: VenueInfo): string {
  const location = venue.region ? `${venue.city}, ${venue.region}` : venue.city;
  return `${venue.stadium} · ${location}, ${venue.country}`;
}

export function formatVenueShort(venue: VenueInfo): string {
  return `${venue.stadium} · ${venue.city}`;
}
