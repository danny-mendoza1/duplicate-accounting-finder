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