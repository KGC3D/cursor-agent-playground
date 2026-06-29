export const MOUNTAIN_TZ = 'America/Denver';

export type RelativeDay = 'today' | 'tomorrow' | null;

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

const dateKeyFmt = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: MOUNTAIN_TZ,
});

/** YYYY-MM-DD in Mountain Time */
export function mountainDateKey(ms: number): string {
  return dateKeyFmt.format(new Date(ms));
}

export function mountainTodayKey(): string {
  return mountainDateKey(Date.now());
}

export function mountainTomorrowKey(): string {
  return mountainDateKey(Date.now() + 86_400_000);
}

export function getRelativeDay(kickoffUtc?: number): RelativeDay {
  if (!kickoffUtc) return null;
  const key = mountainDateKey(kickoffUtc);
  if (key === mountainTodayKey()) return 'today';
  if (key === mountainTomorrowKey()) return 'tomorrow';
  return null;
}

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

export function formatRelativeDayLabel(relative: RelativeDay): string | null {
  if (relative === 'today') return 'Today';
  if (relative === 'tomorrow') return 'Tomorrow';
  return null;
}

export function formatScheduleMountain(kickoffUtc?: number, fallbackDate?: string): {
  day: string;
  subday?: string;
  time: string;
  relative: RelativeDay;
} {
  if (kickoffUtc) {
    const relative = getRelativeDay(kickoffUtc);
    const relativeLabel = formatRelativeDayLabel(relative);

    return {
      day: relativeLabel ?? formatMountainDate(kickoffUtc),
      subday: relative ? formatMountainDateShort(kickoffUtc) : undefined,
      time: formatMountainTimeLabel(kickoffUtc),
      relative,
    };
  }
  return {
    day: fallbackDate ?? '',
    time: '',
    relative: null,
  };
}

export function isMountainToday(kickoffUtc?: number): boolean {
  return getRelativeDay(kickoffUtc) === 'today';
}

export function isMountainTomorrow(kickoffUtc?: number): boolean {
  return getRelativeDay(kickoffUtc) === 'tomorrow';
}
