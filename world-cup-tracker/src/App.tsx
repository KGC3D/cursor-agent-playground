import { useWorldCupData } from './hooks/useWorldCupData';
import { useBracketSimulator } from './hooks/useBracketSimulator';
import { MatchCard } from './components/MatchCard';
import { StandingsTable } from './components/StandingsTable';
import { BracketView } from './components/BracketView';
import { TabBar, type Tab } from './components/TabBar';
import { formatMatchDate, formatKickoffTime } from './data/matches';
import { getTeam } from './data/teams';
import { useState } from 'react';

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('live');
  const {
    standings,
    liveBracket,
    liveMatches,
    todayMatches,
    upcomingMatches,
    finishedMatches,
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

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div className="tournament-badge">FIFA</div>
          <h1 className="app-title">World Cup 2026</h1>
          <p className="app-subtitle">USA · Canada · Mexico</p>
        </div>
        {liveMatches.length > 0 && (
          <div className="live-banner">
            <span className="live-dot" />
            <span>{liveMatches.length} match{liveMatches.length > 1 ? 'es' : ''} live now</span>
          </div>
        )}
        {lastUpdated && (
          <p className="last-updated">
            Updated {lastUpdated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </p>
        )}
      </header>

      <main className="app-content">
        {activeTab === 'live' && (
          <section className="section">
            {liveMatches.length > 0 ? (
              <>
                <h2 className="section-title">Live Now</h2>
                <div className="match-list featured">
                  {liveMatches.map(m => (
                    <MatchCard key={m.id} match={m} />
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">⚽</span>
                <p>No live matches right now</p>
              </div>
            )}

            {todayMatches.filter(m => m.status === 'scheduled').length > 0 && (
              <>
                <h2 className="section-title">Today</h2>
                <div className="match-list">
                  {todayMatches
                    .filter(m => m.status === 'scheduled')
                    .map(m => (
                      <MatchCard key={m.id} match={m} compact />
                    ))}
                </div>
              </>
            )}

            {todayMatches.filter(m => m.status === 'finished').length > 0 && (
              <>
                <h2 className="section-title">Today's Results</h2>
                <div className="match-list">
                  {todayMatches
                    .filter(m => m.status === 'finished')
                    .map(m => (
                      <MatchCard key={m.id} match={m} compact />
                    ))}
                </div>
              </>
            )}

            <h2 className="section-title">Recent Results</h2>
            <div className="match-list">
              {finishedMatches.slice(-6).reverse().map(m => (
                <MatchCard key={m.id} match={m} compact />
              ))}
            </div>
          </section>
        )}

        {activeTab === 'schedule' && (
          <section className="section">
            <h2 className="section-title">Upcoming</h2>
            <div className="match-list">
              {upcomingMatches.map(m => (
                <div key={m.id} className="schedule-item">
                  <div className="schedule-date">
                    <span className="date-day">{formatMatchDate(m.date)}</span>
                    <span className="date-time">{formatKickoffTime(m.time)}</span>
                  </div>
                  <MatchCard match={m} compact />
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'standings' && (
          <section className="section standings-section">
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
