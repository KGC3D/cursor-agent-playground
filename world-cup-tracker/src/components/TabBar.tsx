type Tab = 'live' | 'schedule' | 'standings' | 'bracket';

interface TabBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
  liveCount: number;
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'live', label: 'Live', icon: '●' },
  { id: 'schedule', label: 'Schedule', icon: '☰' },
  { id: 'standings', label: 'Groups', icon: '▦' },
  { id: 'bracket', label: 'Bracket', icon: '◫' },
];

export function TabBar({ active, onChange, liveCount }: TabBarProps) {
  return (
    <nav className="tab-bar">
      {TABS.map(tab => (
        <button
          key={tab.id}
          type="button"
          className={`tab-item ${active === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span className="tab-icon">
            {tab.id === 'live' && liveCount > 0 ? (
              <span className="tab-live-icon">
                <span className="live-dot small" />
              </span>
            ) : (
              tab.icon
            )}
          </span>
          <span className="tab-label">{tab.label}</span>
          {tab.id === 'live' && liveCount > 0 && (
            <span className="tab-badge">{liveCount}</span>
          )}
        </button>
      ))}
    </nav>
  );
}

export type { Tab };
