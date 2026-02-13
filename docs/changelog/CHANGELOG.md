# Changelog

## Evolution of the Project

This project evolved organically based on real user needs and constraints. Rather than following a rigid roadmap, each phase addressed specific pain points discovered during use.

---

### Phase 1: Quick MVP (Initial Implementation)

**Context:** Operations staff needed a fast solution to identify duplicate bills in accounting data. Speed to delivery was critical.

**Implementation:** JSON payload + CSV comparison

- Users would extract JSON payloads from network tab (browser developer tools)
- Compare against CSV exports of bills to be entered
- Identify potential duplicates based on matching keys

**Rationale:** This was the fastest path I knew to solve the immediate problem with my existing skillset. While not the most user-friendly, it provided immediate value.

**Trade-offs Accepted:**

- Required technical knowledge to extract JSON from network tab
- Not accessible to non-technical users
- Manual process for each vendor

---

### Phase 2: User-Friendly Approach

**Context:** Feedback revealed that non-technical users struggled with extracting JSON payloads from the network tab. The technical barrier was preventing wider adoption.

**Implementation:** CSV-to-CSV comparison with multi-vendor support

- Users upload two CSV files for direct comparison
- Support processing multiple vendors in a single operation
- Simplified workflow eliminates need for browser developer tools

**Rationale:** Making the tool accessible to non-technical users was more valuable than maintaining the original implementation. CSV files are familiar to all users.

**Benefits:**

- Dramatically simplified user workflow
- Removed technical barriers to entry
- Enabled batch processing of multiple vendors
- Improved efficiency for regular users

---

### Phase 3: Verification & Transparency

**Context:** Users wanted confidence that the duplicate detection was working correctly. Trust in the results was essential for adoption.

**Implementation:** Added vendor record viewing functionality

- Display all processed records for each vendor
- Show which records were matched as duplicates
- Provide visibility into the matching logic

**Rationale:** Transparency builds trust. By showing exactly what records were processed and how they were matched, users can verify the tool's accuracy.

**Value:**

- Increased user confidence in results
- Enabled users to catch edge cases or data quality issues
- Provided audit trail for accounting purposes

---

### Phase 4: Enhanced User Experience

**Context:** Users requested the ability to sort comparison results to better analyze duplicate patterns and identify discrepancies.

**Implementation:** Sortable column headers for Type and Date

- Click column header to toggle sort: ascending → descending → clear
- Each duplicate group maintains independent sort state
- First row (bills record) always stays at top - only Buildium records sort
- Keyboard accessible with proper ARIA attributes
- Visual indicators show current sort state (↕ ↑ ↓)
- Amount is not sortable (all records in a group have the same amount by design)

**Rationale:** Sorting helps users quickly identify patterns such as:

- All bills vs EFTs for a vendor
- Chronological order to spot trends
- Different payment types at a glance

**Benefits:**

- Faster analysis of duplicate patterns
- Better identification of discrepancies
- Improved user workflow efficiency
- Maintains data integrity (bills record never moves)

---

### Phase 5: Portfolio-Quality Design & UX Refinement

**Context:** After several months of reliable use in production, users requested design improvements for better presentation and readability. The application's core functionality had proven robust through regular real-world use, making this an ideal time to focus on visual polish and user experience refinement.

**Implementation:** Comprehensive design overhaul and enhanced file upload experience

**Design System:**

- Modern purple accent color (`hsl(262 83% 65%)`) matching portfolio brand identity
- Glass morphism effects with semi-transparent cards and backdrop blur
- Professional typography: Inter (UI) and JetBrains Mono (code/data) via Google Fonts
- Smooth transitions, animations, and hover states throughout
- Dark mode optimized with proper contrast ratios (WCAG AA)

**Enhanced File Upload Experience:**

- Fixed bug where clicking anywhere in upload card opened file dialog
- Vertical layout with clear visual hierarchy (labels above inputs)
- Real-time visual feedback: checkmarks appear when files are uploaded
- Smart filename truncation for long names with hover tooltips for full text
- Remove buttons (×) to easily clear file selections
- Fully responsive design supporting mobile devices (iPhone SE 375px+)

**Technical Improvements:**

- Responsive tables with horizontal scroll and visual scroll indicators
- Updated Content Security Policy to allow Google Fonts CDN (HTTPS-only)
- Enhanced accessibility (proper ARIA labels, keyboard navigation, focus states)
- Mobile-optimized spacing, typography, and touch targets

**Rationale:** The project's goal has always been **working, reliable software**. After months of production use confirming the core functionality is solid, investing in professional design demonstrates the same attention to detail in user experience as in the underlying logic. Good UX builds trust, and visual polish reflects the quality of the entire application.

**Benefits:**

- Portfolio-quality presentation showcasing professional UI/UX design standards
- Clearer user feedback throughout the file upload and comparison workflow
- Better mobile experience for portfolio viewers and on-the-go use
- Improved accessibility for users with different needs and devices
- Maintained security posture (client-side only, no analytics, data never leaves device)

**Security Note:** Added Google Fonts CDN to Content Security Policy for professional typography. This introduces an external dependency but maintains core security principles: no executable scripts from external sources, no tracking, and all data processing remains client-side. See ADR-0004 Amendment for full security analysis.

---

### Phase 6: Portfolio Demo & Security Compliance Hardening

**Context:** After establishing the application's core functionality and visual design, focus shifted to ensuring accurate documentation and strict adherence to security principles for portfolio presentation. User feedback requested an easy way to see the application in action, and an internal audit revealed documentation inconsistencies.

**Implementation:** Demo feature and security compliance corrections

**Demo Feature:**
- Added "Or run a demo scenario" button to header
- Loads sample CSV files from `public/` directory via same-origin fetch
- Auto-runs duplicate detection with demo data
- One-click demonstration for portfolio visitors
- Demo files: `Buildium-Export-Demo-File.csv` and `Bills-To-Enter-Demo-File.csv`

**Security Compliance Fixes:**
- **Removed theme toggle and localStorage**: ADR-0002 explicitly prohibits data persistence. Theme toggle used localStorage to remember user preference, violating this principle. Application now defaults to dark mode only.
- **Removed light theme**: Simplified to single dark theme, eliminating persistence requirement
- **Documentation updates**: 
  - Updated README to clarify "no data persistence" includes no localStorage/cookies
  - Amended ADR-0001 to explain demo file fetching
  - Updated CHANGELOG to document security compliance corrections

**Rationale:** 

**Demo Feature:** Portfolio visitors need to quickly see the application in action without uploading their own files. The demo feature provides immediate value demonstration while maintaining security principles (same-origin fetch of static assets, no external APIs, no data transmission).

**Security Compliance:** During documentation review, localStorage usage for theme preference was identified as violating ADR-0002's "no data persistence" principle. While theme preference might seem harmless, maintaining strict adherence to documented security principles builds trust and demonstrates consistency between documentation and implementation.

**Benefits:**
- **Improved portfolio presentation**: One-click demo showcases functionality immediately
- **Documentation accuracy**: Claims match implementation
- **Stricter security posture**: Zero browser storage, zero data persistence
- **Simpler codebase**: Removed theme toggle logic, localStorage calls, and light theme CSS
- **Maintained user experience**: Dark theme preferred by users anyway (based on feedback)

**Security Note:** Demo feature fetches static CSV files from same origin (GitHub Pages), functionally equivalent to loading images or CSS. No user data is transmitted, all processing remains client-side. See ADR-0001 Amendment for full security analysis.

---

## Key Learnings

1. **User feedback drives better solutions** - The CSV-to-CSV approach was not in the original plan but became the core feature
2. **Start simple, iterate based on real use** - The JSON payload approach got working software in users' hands quickly
3. **Transparency matters** - Showing the work builds trust more than hiding complexity
4. **Pragmatism over perfection** - Delivering working features quickly enabled faster learning and better outcomes
5. **Validate assumptions before building** - User feedback prevented wasted effort on unnecessary features
6. **Empower users with flexible analysis tools** - Sortable columns let users explore data their way

---

## Features Considered but Not Implemented

### CSV Export Functionality

**Initial Assumption:** Users would want to export duplicate detection results to CSV for reporting or record-keeping.

**Reality:** After gathering user feedback, it became clear that users preferred to:

- Review duplicates directly in the application interface
- Take action in their accounting system based on what they see
- Not need permanent records of the comparison results

**Decision:** Removed from scope to keep the application focused on its core purpose (detection and verification, not reporting).

**Learning:** Validate feature assumptions with users before implementation.

### Data Persistence (IndexedDB + Web Crypto)

**Initial Consideration:** Store comparison results locally using IndexedDB with Web Crypto encryption for convenience.

**Reality:**

- The use case is session-based - users compare files, review results, and move on
- Adding persistence would introduce complexity without meaningful benefit
- Security goal (data never leaves device) is already met through client-side-only processing

**Decision:** Keep processing in-memory only. Sessions are ephemeral - data exists only while the page is open.

**Learning:** Not every "best practice" applies to every context. The simplest solution that meets user needs is often the best solution.

---

## Technical Decisions

For architectural decisions and their rationale, see the [Architecture Decision Records](./docs/adr) directory.
