# No Export Functionality

- **Status:** Accepted
- **Date:** 2025-10-16
- **Owner:** Danny Mendoza

## Context and Problem Statement

After users identify duplicate accounting entries, should the application provide functionality to export results to CSV or other formats for record-keeping or reporting?

## Considered Options

- **Option 1:** No export - users review results in-app only
- **Option 2:** CSV export - download results as CSV file
- **Option 3:** Multiple formats - CSV, PDF, JSON exports

## Decision Outcome

Chosen option: **No export (Option 1)**, because user feedback revealed that export functionality doesn't align with actual workflow needs.

## Consequences

### Good

- **Simpler codebase**: No need to implement export logic, file generation, or download handling
- **Focused purpose**: Application stays focused on its core function (detection and verification)
- **Less maintenance**: Fewer features to test, debug, and maintain
- **Faster iteration**: Can focus development effort on improving core detection logic

### Bad

- **No permanent records**: Users cannot save comparison results
- **Manual record-keeping**: If users need records, they must screenshot or manually note findings
- **Cannot share results**: No easy way to share findings with colleagues

### Mitigations

- The "bad" consequences don't actually impact users because:
  - Users take action directly in their accounting system based on what they see
  - The comparison is a decision-making tool, not a reporting tool
  - Results don't need to be shared - users act on them individually

## Rationale

Export functionality was initially included in the MVP scope based on an assumption that users would want permanent records of duplicate detection results.

**User feedback revealed:**

1. Users review duplicates in the application interface
2. They take immediate action in their accounting system
3. They don't need or want permanent records of comparisons
4. The comparison is part of their workflow, not an output of it

This helped me enforce a **validate assumptions before building** attitude. What seemed like an obvious feature requirement turned out to be unnecessary complexity.

## User Workflow

The actual workflow is:

1. Upload two CSV files
2. Review duplicates and vendor records in the application
3. Navigate to accounting system
4. Take action (enter bill, skip duplicate, investigate discrepancy)
5. Close the application

Export would add a step that serves no purpose in this workflow.

## Future Considerations

If user needs change (e.g., compliance requirements for audit trails), export functionality could be reconsidered. However, it would need to be driven by actual user need, not assumptions.

## Related Decisions

- [ADR-0001: Client-only Processing](./0001-client-only-processing.md) - Establishes the security-first approach
- [ADR-0002: No Data Persistence](./0002-no-data-persistence.md) - Similar decision to keep the application session-based
