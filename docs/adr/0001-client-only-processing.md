# Client-only processing for v1

- **Status:** Accepted
- **Date:** 2025-09-10
- **Owner:** Danny Mendoza

## Context and Problem Statement

We must process potentially sensitive accounting data (PII/financial) while deploying as a static site (GitHub Pages). How do we minimize data exposure and keep the MVP auditable and simple?

## Considered Options

- Process everything client-side (no server; browser-only)
- Introduce a minimal backend now (API for parsing/grouping; enable auth/settings early)
- Hybrid (client parsing; server for persistence/auth or heavy compute)

## Decision Outcome

Chosen option: **Process everything client-side**, because it eliminates **most** risk of data leaving the user's machine, simplifies deployment/operations for the MVP, and keeps the logic deterministic and easy to test.

## Consequences

- Good: No user data leaves the device; static hosting is simple; fast time-to-value; clear auditability.
- Bad: No server features in v1 (no auth, no cross-device settings, no server logs); memory limits for very large files; careful UX needed for large datasets.
- Notes: If we later need authenticated settings, collaboration, auditing, or heavier compute (e.g., advanced fuzzy matching), we will propose a small backend (exit criteria).

---

## Amendment (2026-02-13): Demo Feature - Same-Origin Static Asset Fetching

### Context

For portfolio demonstration purposes, a demo feature was added to allow visitors to quickly see the application in action without needing to provide their own CSV files.

### Decision

The demo feature fetches two static CSV files from the same origin using the Fetch API:
- `/duplicate-accounting-finder/Buildium-Export-Demo-File.csv`
- `/duplicate-accounting-finder/Bills-To-Enter-Demo-File.csv`

These files are bundled with the application in the `public/` directory and served from the same GitHub Pages domain.

### Rationale for Compatibility with Client-Only Processing

**Key principle maintained:** No user data leaves the device.

The demo feature does not violate the client-only processing principle because:

1. **No user data transmitted**: Demo files are static assets bundled with the application, not user-uploaded data
2. **Same-origin requests**: Files are fetched from the same domain (GitHub Pages), not external APIs
3. **Functionally equivalent to bundled assets**: Fetching static CSV files is similar to loading CSS, fonts, or images
4. **CSP policy allows this**: `connect-src 'self'` permits same-origin fetch requests
5. **No backend processing**: Files are served as static assets, no server-side processing occurs

### Technical Implementation

```typescript
// src/helpers/loadDemoFiles.ts
const [buildiumResponse, billsResponse] = await Promise.all([
  fetch('/duplicate-accounting-finder/Buildium-Export-Demo-File.csv'),
  fetch('/duplicate-accounting-finder/Bills-To-Enter-Demo-File.csv'),
]);
```

### Security Analysis

| Aspect | User Upload Flow | Demo File Flow | Compliance |
|--------|-----------------|----------------|------------|
| Data source | User's device | Application bundle (same origin) | Equal |
| Network transmission | None | Same-origin static file fetch | Equal |
| Processing location | Client browser | Client browser | Equal |
| Data persistence | In-memory only | In-memory only | Equal |
| External dependencies | None | None | Equal |

### What Changed

**Added:**
- Network requests to fetch demo CSV files from same origin
- Demo button that loads files and auto-runs duplicate detection

**Unchanged:**
- No user data leaves the device
- All processing remains client-side
- No external API calls
- No telemetry or tracking
- No data persistence (demo results cleared on page close)

### Rationale

This amendment clarifies that same-origin static asset fetching (like loading images, fonts, or CSS) does not contradict the "client-only processing" principle. The core security goals remain intact:

1. **User data never leaves the device** - Demo files are not user data
2. **No backend processing** - Files are static assets, not API responses
3. **No external dependencies** - Same-origin only, no third-party services
4. **Transparent to users** - Demo is optional, clearly labeled

The demo feature enhances portfolio presentation while maintaining the security posture established in this ADR.
