# No Data Persistence (In-Memory Only)

- **Status:** Accepted
- **Date:** 2025-10-16
- **Owner:** Danny Mendoza

## Context and Problem Statement

Users process potentially sensitive accounting data (PII/financial records) for duplicate detection. Should we persist comparison results locally (IndexedDB) for convenience, or keep all processing ephemeral and in-memory only?

## Considered Options

- **Option 1:** In-memory only - data exists only during browser session
- **Option 2:** IndexedDB with Web Crypto encryption - persist results locally with encryption
- **Option 3:** Hybrid - optional persistence that users can enable/disable

## Decision Outcome

Chosen option: **In-memory only (Option 1)**, because it matches the actual use case, maintains the simplest security posture, and avoids unnecessary complexity.

## Consequences

### Good

- **Simplest security model**: Data automatically cleared when page closes - no need for "Clear data" buttons or encryption key management
- **Matches actual workflow**: Users perform one-time comparisons, review results, then take action in their accounting system
- **No encryption complexity**: No need to implement or maintain Web Crypto encryption
- **Transparent to users**: Clear mental model - close the tab, data is gone

### Bad

- **No result history**: Users cannot review previous comparisons
- **Must re-upload for repeated comparisons**: If users close the tab, they must start over
- **No cross-session convenience**: Cannot save state between visits

### Mitigations

- The "bad" consequences don't actually matter for this use case:
  - Users don't need comparison history
  - Re-uploading two CSV files is fast (< 5 seconds)
  - The workflow is session-based by nature

## Rationale

Initial documentation mentioned IndexedDB + Web Crypto as an "optional" feature, suggesting it might be useful. However:

1. **User feedback confirmed**: No one asked for or needed persistent storage
2. **Security goal already met**: Client-side processing already ensures data never leaves the device
3. **Complexity vs. value**: Adding IndexedDB + Web Crypto would introduce significant complexity (key management, migration, clear data UI) for zero user benefit

The simplest solution that meets user needs is the best solution.

## Related Decisions

- [ADR-0001: Client-only Processing](./0001-client-only-processing.md) - Establishes the security-first approach
- [ADR-0003: No Export Functionality](./0003-no-export-functionality.md) - Another feature validated against actual user needs
