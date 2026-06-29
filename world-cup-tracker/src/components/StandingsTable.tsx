import { getTeam } from '../data/teams';
import type { GroupStanding } from '../data/matches';

interface StandingsTableProps {
  group: string;
  standings: GroupStanding[];
}

export function StandingsTable({ group, standings }: StandingsTableProps) {
  return (
    <div className="standings-card">
      <h3 className="standings-title">Group {group}</h3>
      <table className="standings-table">
        <thead>
          <tr>
            <th className="col-team">Team</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GD</th>
            <th className="col-pts">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => {
            const team = getTeam(s.teamId);
            const qualifies = i < 2;
            return (
              <tr key={s.teamId} className={qualifies ? 'qualifying' : ''}>
                <td className="col-team">
                  <span className="standings-rank">{i + 1}</span>
                  <span className="team-flag small">{team.flag}</span>
                  <span>{team.abbr}</span>
                </td>
                <td>{s.played}</td>
                <td>{s.won}</td>
                <td>{s.drawn}</td>
                <td>{s.lost}</td>
                <td className={s.gd > 0 ? 'positive' : s.gd < 0 ? 'negative' : ''}>
                  {s.gd > 0 ? `+${s.gd}` : s.gd}
                </td>
                <td className="col-pts">{s.pts}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
