export const MOUNTAIN_TZ = 'America/Denver';

const timeFmt = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: MOUNTAIN_TZ,
  timeZoneName: 'short',
});

const dateFmt = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  timeZone: MOUNTAIN_TZ,
});

const dateShortFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: MOUNTAIN_TZ,
});

/** e.g. "4:30 PM MDT" */
export function formatMountainTime(ms: number): string {
  return timeFmt.format(new Date(ms));
}

/** e.g. "Mon, Jun 29" */
export function formatMountainDate(ms: number): string {
  return dateFmt.format(new Date(ms));
}

/** e.g. "Jun 29" */
export function formatMountainDateShort(ms: number): string {
  return dateShortFmt.format(new Date(ms));
}

/** Time only with MT label, e.g. "4:30 PM MT" */
export function formatMountainTimeLabel(ms: number): string {
  const formatted = formatMountainTime(ms);
  // Normalize MDT/MST to MT for consistency, or keep MDT/MST - user asked "mountain time"
  // Using MDT/MST from Intl is more accurate; append "Mountain" is verbose.
  // Replace MST/MDT with MT as user requested "mountain time"
  return formatted.replace(/\s(MST|MDT)$/, ' MT');
}

export function formatUpdatedMountain(date: Date): string {
  return formatMountainTimeLabel(date.getTime());
}

export function formatKickoffMountain(kickoffUtc?: number, fallbackTime?: string): string {
  if (kickoffUtc) return formatMountainTimeLabel(kickoffUtc);
  if (fallbackTime) {
    const m = fallbackTime.match(/(\d{1,2}):(\d{2})/);
    return m ? `${m[1]}:${m[2]} MT` : `${fallbackTime} MT`;
  }
  return '';
}

export function formatScheduleMountain(kickoffUtc?: number, fallbackDate?: string): {
  day: string;
  time: string;
} {
  if (kickoffUtc) {
    return {
      day: formatMountainDate(kickoffUtc),
      time: formatMountainTimeLabel(kickoffUtc),
    };
  }
  return {
    day: fallbackDate ?? '',
    time: '',
  };
}
