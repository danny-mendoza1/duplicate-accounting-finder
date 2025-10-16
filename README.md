# Duplicate Accounting Finder

![Build](https://img.shields.io/github/actions/workflow/status/danny-mendoza1/duplicate-accounting-finder/ci.yml?branch=main)
![License](https://img.shields.io/github/license/danny-mendoza1/duplicate-accounting-finder)
![Code Style](https://img.shields.io/badge/code%20style-prettier-ff69b4.svg)
![TypeScript](https://img.shields.io/badge/language-TypeScript-3178c6?logo=typescript&logoColor=white)

**[🚀 Live Demo](https://danny-mendoza1.github.io/duplicate-accounting-finder/)** | [Report Bug](https://github.com/danny-mendoza1/duplicate-accounting-finder/issues) | [Request Feature](https://github.com/danny-mendoza1/duplicate-accounting-finder/issues)

A client-side web application for detecting and grouping duplicate accounting entries across CSV exports.  
All processing happens securely in the browser — **no data leaves the device**.

---

## Table of Contents

- [Problem](#problem)
- [Goals](#goals)
- [Non-Goals](#non-goals-v1)
- [Constraints & Security Posture](#constraints--security-posture-v1)
- [Current Features](#current-features)
- [Future Considerations](#future-considerations)
- [Architecture](#architecture-v1)
- [Definition of Done](#definition-of-done-v1)
- [Development Approach](#development-approach)
- [Project Management](#project-management)
- [Quick Start (Dev)](#quick-start-dev)
- [Contributing](#contributing)
- [License](#license)
- [References](#references-official)

---

## Problem

Operations staff need to quickly **identify and review potential duplicate accounting entries** across CSV exports. Current workflows are manual and error-prone.

## Goals

- Upload **two CSV files** for direct comparison (evolved from initial JSON + CSV approach)
- Compare records using **predefined matching keys** (e.g., date, amount, vendor)
- Support **multiple vendors** in a single comparison operation
- **Group duplicates** and display with full record context
- **View processed vendor records** for verification and transparency
- Perform **all processing client-side** - no data leaves the browser

## Non-Goals (v1)

- No server/API or database.
- No analytics or third-party scripts.
- No fuzzy matching/scoring (deterministic first).

## Constraints & Security Posture (v1)

- **PII never leaves the device** - all processing happens client-side in the browser.
- **Static hosting** (GitHub Pages) - no server means no data transmission.
- **Strict Content Security Policy (CSP)** - prevents XSS attacks by restricting script sources.
- **No telemetry** - no analytics or tracking of any kind.
- **No data persistence** - data exists only while the page is open.

---

## Current Features

1. **CSV-to-CSV Comparison**: Upload two CSV files for direct comparison
2. **Multi-Vendor Support**: Process multiple vendors in a single operation
3. **Duplicate Detection**: Identify duplicates based on predefined matching keys (date, amount, vendor)
4. **Results Display**: View grouped duplicates with full record context
5. **Vendor Record Viewing**: Review all processed records for each vendor to verify accuracy
6. **Data Privacy**: All processing happens client-side - no data ever leaves your browser

See [CHANGELOG.md](./CHANGELOG.md) for the evolution of these features.

### Future Considerations

- User-defined matching keys and normalization options
- Optional backend for authenticated settings, collaboration, or advanced analytics
- Enhanced fuzzy matching for edge cases
- Export options beyond CSV

---

## Architecture (v1)

```text
File Inputs → Parsers (CSV) → Normalizers → Grouper (key-based)
→ Results View (table + details)
```

All processing happens in-memory during the browser session. No data is persisted.

---

## Definition of Done (v1)

- Type-safe parsing and grouping logic with unit tests.
- Keyboard-navigable UI; labeled inputs; WCAG 2.2 AA color contrast.
- Reproducible build; deployed to GitHub Pages.
- Security review: strict CSP; zero third-party scripts; no telemetry.
- README + ADRs + CI (typecheck, lint, unit tests) pass on PRs.

---

## Development Approach

This is a portfolio project that evolved organically through iterative development. While maintaining quality standards, the approach prioritizes delivering working features and learning from real use.

**Code Quality:**
- TypeScript with `strict: true` - no `any` in core logic
- ESLint + Prettier for consistent style
- Unit tests for core business logic
- Automated CI checks (typecheck, lint, tests) before deployment

**Development Practices:**
- Generally follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for clarity
- [Architecture Decision Records](./docs/adr) for significant technical decisions
- Feature branches merged via pull requests
- GitHub Actions for CI/CD pipeline

**Security & Privacy:**
- Strong **Content Security Policy** - prevents XSS attacks
- All data processing happens client-side - nothing leaves the device
- In-memory only - no data persistence between sessions

**Note:** As a solo project requiring fast iteration, I prioritized delivering working software and gathering user feedback over rigid process adherence. The [CHANGELOG](./docs/changelog/CHANGELOG.md) documents how the project evolved based on real-world needs.

---

## Project Management

This project uses lightweight, pragmatic project management:

- **GitHub Issues** for feature tracking, bug reports, and discussions
- **Pull Requests** for code review, documentation, and change tracking
- **GitHub Actions** for automated CI/CD (typecheck, lint, tests, deployment)
- **Milestones** for grouping related features and tracking major releases

See [CHANGELOG.md](./docs/changelog/CHANGELOG.md) for the evolution of features and the decision-making process behind major changes.

---

## Quick Start (Dev)

```bash
# Clone
git clone https://github.com/danny-mendoza1/duplicate-accounting-finder.git
cd duplicate-accounting-finder

# Install dependencies
npm install

# Run dev server
npm run dev
```

---

## Contributing

This is a portfolio project, but contributions are welcome.

- Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
- Open an issue before major changes.
- All work must come via PR linked to an issue.

---

## License

[MIT License](./LICENSE)

---

## References (official)

- [GitHub Docs: About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
- [MDN File API](https://developer.mozilla.org/en-US/docs/Web/API/File)
- [W3C Content Security Policy](https://www.w3.org/TR/CSP3/)
- [React Docs – Thinking in React](https://react.dev/learn/thinking-in-react)
