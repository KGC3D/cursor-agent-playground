import type { Match } from '../data/matches';
import {
  formatMountainDate,
  formatMountainTimeLabel,
  getRelativeDay,
  formatRelativeDayLabel,
  mountainDateKey,
} from './timezone';

export interface ResultDateGroup {
  key: string;
  label: string;
  matches: Match[];
}

export function groupResultsByDate(matches: Match[]): ResultDateGroup[] {
  const groups = new Map<string, Match[]>();

  for (const m of matches) {
    const key = m.kickoffUtc ? mountainDateKey(m.kickoffUtc) : m.date;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(m);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, groupMatches]) => {
      const first = groupMatches[0];
      const relative = first.kickoffUtc ? getRelativeDay(first.kickoffUtc) : null;
      const relativeLabel = formatRelativeDayLabel(relative);
      const label = relativeLabel
        ? relativeLabel
        : first.kickoffUtc
          ? formatMountainDate(first.kickoffUtc)
          : key;

      return { key, label, matches: groupMatches };
    });
}

export function formatResultHeader(match: Match): string {
  if (!match.kickoffUtc) return 'Final';
  const relative = formatRelativeDayLabel(getRelativeDay(match.kickoffUtc));
  const time = formatMountainTimeLabel(match.kickoffUtc);
  if (relative) return `${relative} · ${time}`;
  return `${formatMountainDate(match.kickoffUtc)} · ${time}`;
}
