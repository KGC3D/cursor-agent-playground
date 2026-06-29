import { useWorldCupData } from './hooks/useWorldCupData';
import { useBracketSimulator } from './hooks/useBracketSimulator';
import { MatchCard } from './components/MatchCard';
import { StandingsTable } from './components/StandingsTable';
import { BracketView } from './components/BracketView';
import { TabBar, type Tab } from './components/TabBar';
import { formatUpdatedMountain } from './utils/timezone';
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
  const recentResults = phaseResults;

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
            {liveMatches.length > 0 && (
              <>
                <h2 className="section-title">Live Now</h2>
                <MatchList matches={liveMatches} featured />
              </>
            )}

            {todayUpcoming.length > 0 && (
              <>
                <h2 className="section-title">Up Next</h2>
                <p className="section-subtitle">Today · {currentPhaseLabel}</p>
                <MatchList matches={todayUpcoming} compact />
              </>
            )}

            {liveMatches.length === 0 && todayUpcoming.length === 0 && (
              <div className="empty-state">
                <span className="empty-icon">⚽</span>
                <p>No matches live right now</p>
                <p className="empty-hint">Check Schedule for upcoming fixtures</p>
              </div>
            )}
          </section>
        )}

        {activeTab === 'schedule' && (
          <section className="section">
            {recentResults.length > 0 && (
              <div className="schedule-phase">
                <h2 className="section-title">Results</h2>
                <p className="section-subtitle">{currentPhaseLabel}</p>
                <MatchList matches={recentResults} compact />
              </div>
            )}

            {scheduleSections.map(section => (
              <div key={section.phase} className="schedule-phase">
                <h2 className="section-title">{section.label}</h2>
                <div className="match-list">
                  {section.matches.map(m => (
                    <MatchCard key={m.id} match={m} schedule />
                  ))}
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
