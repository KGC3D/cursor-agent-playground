# AGENTS.md

## Cursor Cloud specific instructions

This is `cursor-agent-playground`, a sandbox repository for testing Cursor Cloud Agents. On the `main` branch there is no application, no dependency manifest, and no services to run — only `README.md`, `TASKS.md`, and starter demo files.

- Preinstalled tooling: Node.js 22, npm 10, Python 3.12, git, and bash. No install step is required for the current repo state.
- There is no build, lint, or test framework configured. Adding one is a valid starter task (see `TASKS.md`).
- To sanity-check that the environment runs code, use the greeting demo: `node greet.js` (optionally `node greet.js "<name>"`).
- The update script installs Node dependencies only if a `package.json`/lockfile is later added; today it is effectively a no-op because none exist.
