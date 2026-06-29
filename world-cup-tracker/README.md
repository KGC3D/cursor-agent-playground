# World Cup 2026 Tracker

A live World Cup tracking web app inspired by Apple Sports. Built with React + Vite + TypeScript.

## Features

- **Live Scores** — Real-time match updates with animated live indicators
- **Schedule** — Upcoming fixtures with venue and kickoff times
- **Group Standings** — All 8 groups with qualification highlighting
- **Knockout Bracket** — Full tournament bracket from Round of 32 to Final
- **Bracket Simulator** — Tap teams to simulate outcomes and crown a champion

## Data Source

Live tournament data is fetched from the [openfootball/worldcup.json](https://github.com/openfootball/worldcup.json) public dataset — updated from official FIFA World Cup 2026 results. The app auto-refreshes every 60 seconds.

## Deploy

### GitHub Pages (recommended)

Push to `main` and enable **GitHub Pages → Source: GitHub Actions** in repo settings. The app will be available at:

**https://kgc3d.github.io/cursor-agent-playground/**

### Local

```bash
cd world-cup-tracker
npm install
npm run dev
```

Open http://localhost:5173 on mobile or desktop (optimized for 430px mobile viewport).


## Tech Stack

- React 19 + TypeScript
- Vite
- CSS custom properties (Apple Sports dark theme)
- No external UI libraries
