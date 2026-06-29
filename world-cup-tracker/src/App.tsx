import { useWorldCupData } from './hooks/useWorldCupData';
import { useBracketSimulator } from './hooks/useBracketSimulator';
import { MatchCard } from './components/MatchCard';
import { StandingsTable } from './components/StandingsTable';
import { BracketView } from './components/BracketView';
import { TabBar, type Tab } from './components/TabBar';
import { formatMatchDate } from './data/matches';
import { formatScheduleMountain, formatUpdatedMountain } from './utils/timezone';
import { getTeam } from './data/teams';
import { useState } from 'react';

function MatchList({ matches, compact, featured }: {
  matches: ReturnType<typeof useWorldCupData>['matches'];
  compact?: boolean;
  featured?: boolean;
}) {
  if (matches.length === 0) return null;
  return (
    <div className={`match-list ${featured ? 'featured' : ''}`}>
      {matches.map(m => (
        <MatchCard key={m.id} match={m} compact={compact} />
      ))}
    </div>
  );
}

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('live');
  const {
    standings,
    liveBracket,
    liveMatches,
    todayMatches,
    tomorrowMatches,
    phaseResults,
    scheduleSections,
    currentPhaseLabel,
    groupStageComplete,
    lastUpdated,
    loading,
    error,
    refresh,
  } = useWorldCupData();
  const { bracket, simMode, setSimMode, pickWinner, reset } = useBracketSimulator(liveBracket);

  if (loading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <span className="loading-icon">⚽</span>
          <p>Loading World Cup 2026...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-screen">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button type="button" className="retry-btn" onClick={refresh}>Retry</button>
        </div>
      </div>
    );
  }

  const groupKeys = Object.keys(standings).sort();
  const todayUpcoming = todayMatches.filter(m => m.status === 'scheduled');
  const todayFinished = todayMatches.filter(m => m.status === 'finished');
  const earlierPhaseResults = phaseResults.filter(
    m => !todayFinished.some(t => t.id === m.id)
  );

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div className="tournament-badge">FIFA</div>
          <h1 className="app-title">World Cup 2026</h1>
          <p className="app-subtitle">USA · Canada · Mexico</p>
        </div>
        <div className="phase-banner">{currentPhaseLabel}</div>
        {liveMatches.length > 0 && (
          <div className="live-banner">
            <span className="live-dot" />
            <span>{liveMatches.length} match{liveMatches.length > 1 ? 'es' : ''} live now</span>
          </div>
        )}
        {lastUpdated && (
          <p className="last-updated">
            Updated {formatUpdatedMountain(lastUpdated)} Mountain
          </p>
        )}
      </header>

      <main className="app-content">
        {activeTab === 'live' && (
          <section className="section">
            {liveMatches.length > 0 ? (
              <>
                <h2 className="section-title">Live Now</h2>
                <p className="section-subtitle">{currentPhaseLabel}</p>
                <MatchList matches={liveMatches} featured />
              </>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">⚽</span>
                <p>No live matches right now</p>
                <p className="empty-hint">{currentPhaseLabel} continues soon</p>
              </div>
            )}

            {todayUpcoming.length > 0 && (
              <>
                <h2 className="section-title">Today</h2>
                <p className="section-subtitle">{currentPhaseLabel}</p>
                <MatchList matches={todayUpcoming} compact />
              </>
            )}

            {tomorrowMatches.length > 0 && (
              <>
                <h2 className="section-title">Tomorrow</h2>
                <p className="section-subtitle">{currentPhaseLabel}</p>
                <MatchList matches={tomorrowMatches} compact />
              </>
            )}

            {todayFinished.length > 0 && (
              <>
                <h2 className="section-title">Today's Results</h2>
                <p className="section-subtitle">{currentPhaseLabel}</p>
                <MatchList matches={todayFinished} compact />
              </>
            )}

            {earlierPhaseResults.length > 0 && (
              <>
                <h2 className="section-title">{currentPhaseLabel} Results</h2>
                <MatchList matches={earlierPhaseResults} compact />
              </>
            )}

            {groupStageComplete && (
              <p className="phase-note">
                Group stage complete — see the Groups tab for final standings
              </p>
            )}
          </section>
        )}

        {activeTab === 'schedule' && (
          <section className="section">
            {scheduleSections.map(section => (
              <div key={section.phase} className="schedule-phase">
                <h2 className="section-title">{section.label}</h2>
                <div className="match-list">
                  {section.matches.map(m => {
                    const { day, subday, time, relative } = formatScheduleMountain(m.kickoffUtc, formatMatchDate(m.date));
                    return (
                    <div key={m.id} className={`schedule-item ${relative ? `is-${relative}` : ''}`}>
                      <div className={`schedule-date ${relative ?? ''}`}>
                        <span className="date-day">{day}</span>
                        {subday && <span className="date-subday">{subday}</span>}
                        <span className="date-time">{time}</span>
                      </div>
                      <MatchCard match={m} compact />
                    </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        )}

        {activeTab === 'standings' && (
          <section className="section standings-section">
            {groupStageComplete && (
              <p className="phase-note">Group stage final standings</p>
            )}
            {groupKeys.map(group => (
              <StandingsTable key={group} group={group} standings={standings[group]} />
            ))}
          </section>
        )}

        {activeTab === 'bracket' && (
          <section className="section bracket-section">
            <div className="bracket-controls">
              <div className="sim-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${!simMode ? 'active' : ''}`}
                  onClick={() => setSimMode(false)}
                >
                  Live
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${simMode ? 'active' : ''}`}
                  onClick={() => setSimMode(true)}
                >
                  Simulator
                </button>
              </div>
              {simMode && (
                <button type="button" className="reset-btn" onClick={reset}>
                  Reset
                </button>
              )}
            </div>

            {simMode && (
              <p className="sim-hint">
                Tap a team to advance them through the bracket
              </p>
            )}

            <BracketView
              matches={bracket}
              simMode={simMode}
              onPickWinner={pickWinner}
            />

            {bracket.find(m => m.round === 'final')?.winnerId && (
              <div className="champion-banner">
                <span className="champion-trophy">🏆</span>
                <h2>World Cup Champion</h2>
                <p className="champion-name">
                  {(() => {
                    const winnerId = bracket.find(m => m.round === 'final')!.winnerId!;
                    const t = getTeam(winnerId);
                    return `${t.flag} ${t.name}`;
                  })()}
                </p>
              </div>
            )}
          </section>
        )}
      </main>

      <TabBar
        active={activeTab}
        onChange={setActiveTab}
        liveCount={liveMatches.length}
      />
    </div>
  );
}
