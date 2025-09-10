# Duplicate Accounting Finder
![Build](https://img.shields.io/github/actions/workflow/status/danny-mendoza1/duplicate-accounting-finder/ci.yml?branch=main)
![License](https://img.shields.io/github/license/danny-mendoza1/duplicate-accounting-finder)
![Code Style](https://img.shields.io/badge/code%20style-prettier-ff69b4.svg)
![TypeScript](https://img.shields.io/badge/language-TypeScript-3178c6?logo=typescript&logoColor=white)


A client-side web application for detecting and grouping duplicate accounting entries across CSV and JSON exports.  
All processing happens securely in the browser — **no data leaves the device**.

---

## Table of Contents
- [Problem](#problem)
- [Goals](#goals)
- [Non-Goals](#non-goals-v1)
- [Constraints & Security Posture](#constraints--security-posture-v1)
- [MVP Scope](#mvp-scope-first-iteration)
- [Future Iterations](#future-iterations)
- [Architecture](#architecture-v1)
- [Definition of Done](#definition-of-done-v1)
- [Standards & Conventions](#standards--conventions)
- [Project Management](#project-management)
- [Quick Start (Dev)](#quick-start-dev)
- [Contributing](#contributing)
- [License](#license)
- [References](#references-official)

---

## Problem
Operations staff need to quickly **identify and review potential duplicate accounting entries** across CSV/JSON exports. Current workflows are manual and error-prone.

## Goals
- Paste a **JSON** payload and **upload a CSV**.
- Compare records using **predefined matching keys** (e.g., date, amount, vendor).
- **Group duplicates** and show contextual fields (not just match keys).
- Perform **all processing client-side**; no data leaves the browser.

## Non-Goals (v1)
- No server/API or database.
- No analytics or third-party scripts.
- No fuzzy matching/scoring (deterministic first).

## Constraints & Security Posture (v1)
- **PII never leaves the device**.
- **Static hosting** (GitHub Pages).
- Optional **local persistence** (IndexedDB) is **off by default**; if enabled, data is **encrypted (Web Crypto)** and there is a prominent **“Clear all data”** control.
- **Strict CSP**: self-only scripts/styles, no inline scripts, no external origins.
- **No telemetry** in v1; any future metrics must be opt-in and privacy-preserving.

---

## MVP Scope (First Iteration)
1. Paste JSON + upload CSV.
2. Choose a predefined “duplicate rule” (composed of specific keys).
3. Display groups (table) with a details panel.
4. Export grouped results to CSV.
5. “Clear all data” wipes memory and IndexedDB.

### Future Iterations
- **v1.1**: User-defined keys & normalization options.
- **v1.2**: CSV + CSV comparison (no JSON needed).
- **v2**: Optional backend (auth, user settings, DB), role-based access.

---

## Architecture (v1)
```text
File Inputs → Parsers (CSV/JSON) → Normalizers → Grouper (key-based)
→ Results View (table + details) → Exporter (CSV)
                        ↘ Optional Local Persistence (IndexedDB + Web Crypto)
```

---

## Definition of Done (v1)
- Type-safe parsing and grouping logic with unit tests.
- Keyboard-navigable UI; labeled inputs; WCAG 2.2 AA color contrast.
- Reproducible build; deployed to GitHub Pages.
- Security review: strict CSP; zero third-party scripts; “Clear all data”.
- README + ADRs + CI (typecheck, lint, unit tests) pass on PRs.

---

## Standards & Conventions
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)  
- **Versioning**: [Semantic Versioning (SemVer)](https://semver.org/)  
- **Changelog**: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)  
- **Lint/Format**: `eslint` (typescript-eslint recommended) + `prettier`.  
- **TypeScript**: `strict: true`. No `any` in core logic; narrow types at boundaries.  
- **Security**: Strong **Content Security Policy**; no inline scripts; no analytics.  
- **Data**: In-memory by default; optional IndexedDB with Web Crypto if enabled.  
- **CI**: GitHub Actions — typecheck, lint, tests on PR; deploy on `main`.

---

## Project Management
- **Milestones**:  
  - `v0.1.0 - MVP` (JSON+CSV, fixed keys).  
- **Issues**: User stories with acceptance criteria; each change via PR that links the issue (`Closes #n`).  
- **Process**: Issues created in [Project Roadmap](../../projects) and tracked through To Do → In Progress → In Review → Done.

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
- [MDN IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)  
- [MDN Web Crypto](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)  
- [W3C Content Security Policy](https://www.w3.org/TR/CSP3/)  
- [React Docs – Thinking in React](https://react.dev/learn/thinking-in-react)
