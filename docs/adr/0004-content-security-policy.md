# Content Security Policy Implementation

- **Status:** Accepted (Amended)
- **Date:** 2025-10-16 (Amended: 2026-02-03)
- **Owner:** Danny Mendoza

## Context and Problem Statement

As a web application processing sensitive financial data, how do we protect against Cross-Site Scripting (XSS) attacks and other injection vulnerabilities beyond just client-side processing?

## Considered Options

- **Option 1:** No CSP - rely on React's built-in XSS protections and careful coding
- **Option 2:** Strict CSP via meta tag - restrictive policies blocking most external resources
- **Option 3:** Permissive CSP - allow CDNs and some external resources for flexibility

## Decision Outcome

Chosen option: **Strict CSP via meta tag (Option 2)**, because it provides defense-in-depth security with minimal development overhead.

## Implementation

Added CSP via meta tag in `index.html`:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data:; 
               font-src 'self'; 
               connect-src 'self'"
/>
```

### Policy Breakdown

- **`default-src 'self'`**: Default policy - only load resources from same origin
- **`script-src 'self'`**: JavaScript only from same origin (no inline scripts, no CDNs)
- **`style-src 'self' 'unsafe-inline'`**: CSS from same origin + inline styles (needed for React/Vite)
- **`img-src 'self' data:`**: Images from same origin + data URIs (for icons)
- **`font-src 'self'`**: Fonts from same origin only
- **`connect-src 'self'`**: AJAX/fetch/WebSocket to same origin only

## Consequences

### Good

- **XSS protection**: Even if an XSS vulnerability exists, injected scripts cannot load from external sources
- **No external dependencies**: Policy enforces our "no third-party scripts" security goal
- **Defense in depth**: Adds security layer beyond code-level protections
- **Minimal performance impact**: CSP validation happens in browser, no runtime cost
- **Simple implementation**: Single meta tag, no build configuration needed

### Bad

- **`'unsafe-inline'` for styles**: Had to allow inline styles for React/Vite to work properly
- **Debugging complexity**: CSP violations show in console, may confuse during development
- **Build tool constraints**: Must ensure Vite doesn't inject external scripts

### Trade-offs Accepted

- **`'unsafe-inline'` for styles** is necessary for modern React development and doesn't meaningfully reduce XSS protection (most XSS is JavaScript, not CSS)
- Could tighten to use nonces/hashes in future, but current policy is sufficient for v1

## Rationale

This decision aligns with our security-first approach established in ADR-0001 (Client-only Processing):

1. **User trust**: Demonstrates commitment to security beyond just "no server"
2. **Attack surface reduction**: Prevents entire classes of attacks (XSS, clickjacking, etc.)
3. **Documentation alignment**: README claimed "Strict CSP" - this makes it reality
4. **Best practice**: CSP is industry standard for web application security

The CSP meta tag approach is simpler than HTTP headers for static hosting on GitHub Pages, and just as effective for our use case.

## Testing

Verified CSP implementation:

- Check browser console for CSP violations
- Confirm no external resources are loaded
- Test that application functions correctly with CSP enabled
- Verify both development and production builds respect CSP

## Related Decisions

- [ADR-0001: Client-only Processing](./0001-client-only-processing.md) - Establishes the security-first approach
- [ADR-0002: No Data Persistence](./0002-no-data-persistence.md) - Part of overall data security strategy

## References

- [MDN Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [W3C CSP Level 3](https://www.w3.org/TR/CSP3/)

---

## Amendment (2026-02-03): Google Fonts CDN Exception

### Context

After several months of production use validating the application's core functionality and security model, focus shifted to UI/UX refinement for portfolio presentation. Professional typography (Inter for UI, JetBrains Mono for code/data) was identified as critical for demonstrating design quality and brand consistency.

### Decision

Added Google Fonts CDN to CSP policy:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self';
           script-src 'self';
           style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
           font-src 'self' https://fonts.gstatic.com;
           img-src 'self' data:;
           connect-src 'self'"
/>
```

**Changes from original policy:**
- `style-src`: Added `https://fonts.googleapis.com` (for font CSS)
- `font-src`: Added `https://fonts.gstatic.com` (for font files)

### Rationale

- **Production-validated security**: Core security model proven through months of real-world use
- **Portfolio quality**: Professional typography critical for portfolio project presentation
- **Maintained security goals**: No executable JavaScript from external sources
- **Maintained privacy goals**: No analytics, tracking, or telemetry
- **Minimal risk**: Fonts are static assets, cannot execute code
- **HTTPS-only**: Secure transport layer guaranteed
- **Reputable provider**: Google's CDN infrastructure is industry-standard
- **Browser caching**: Fonts cached across sites, improving performance

### Security Impact Analysis

**Risk Assessment:**

| Risk Type | Impact | Mitigation |
|-----------|--------|------------|
| XSS/Injection attacks | No change | Fonts cannot execute code |
| Data exfiltration | No change | No user data transmitted in font requests |
| Privacy | No change | Font requests are anonymous, no tracking |
| Availability | Low | Browser caching + system font fallbacks |
| Supply chain | Very low | Google Fonts widely trusted, HTTPS-only |

**What Changed:**
- External dependency introduced (fonts.googleapis.com, fonts.gstatic.com)
- Network requests made on page load (fonts only, HTTPS)

**What Didn't Change:**
- No executable scripts from external sources (`script-src 'self'` unchanged)
- All data processing remains client-side
- No analytics or tracking
- No user data transmission

### Consequences

**Good:**
- Professional typography improves portfolio presentation quality
- Fast CDN delivery with widespread browser caching
- Industry-standard fonts (Inter, JetBrains Mono) improve readability
- Demonstrates attention to design detail matching code quality

**Bad:**
- External dependency on Google's infrastructure
- Small deviation from "no third-party resources" principle
- Network requests required on page load (minimal, fonts only)

**Mitigations:**
- HTTPS-only connections prevent man-in-the-middle attacks
- Could add Subresource Integrity (SRI) hashes in future for additional validation
- Could self-host fonts later if Google CDN becomes a concern
- System fonts serve as graceful fallback if CDN unavailable

### Decision Rationale

This exception maintains the **spirit and core goals** of the original ADR-0004 decision:

1. **No malicious code execution** - Fonts are static assets, not executable
2. **No data leakage** - Font requests don't include user data
3. **No tracking** - Google Fonts requests are anonymous
4. **Security-first approach maintained** - Core protections (`script-src 'self'`) unchanged
5. **Defense in depth** - XSS protections remain fully intact

The trade-off (external font dependency for professional presentation) is acceptable given:
- Application's production-validated security model over several months
- Portfolio context requiring professional design standards
- Minimal security impact (fonts cannot compromise data or execute code)
- Maintained core principle: working, reliable, secure software

### Related Changes

- See [CHANGELOG Phase 5](../../docs/changelog/CHANGELOG.md) for full design system implementation
- Font files loaded: Inter (variable weight 400-800), JetBrains Mono (variable weight 400-700)
- Preconnect hints added to `index.html` for performance optimization
- Fallback to system fonts (`system-ui`, `Consolas`) if CDN unavailable

---

## Amendment #2 (2026-02-04): Self-Hosted Fonts

### Context

While reviewing the portfolio's security architecture and adherence to ADR-0001 (Client-only Processing), I identified an opportunity to maintain the professional typography introduced in Amendment #1 while eliminating the external CDN dependency. This returns the application to a pure client-side posture with zero external resource dependencies.

### Decision

Self-host Inter and JetBrains Mono variable fonts locally rather than loading from Google Fonts CDN.

**Implementation:**
- Downloaded variable font files (WOFF2 format) to `public/fonts/`
  - `inter-variable.woff2` (~290 KB)
  - `jetbrains-mono-variable.woff2` (~291 KB)
- Added `@font-face` declarations in `src/index.css`
- Removed Google Fonts `<link>` tags and preconnect hints from `index.html`
- Reverted CSP policy to strict mode (removed Google Fonts URLs)

**New CSP Policy (back to strict):**
```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self';
           script-src 'self';
           style-src 'self' 'unsafe-inline';
           img-src 'self' data:;
           font-src 'self';
           connect-src 'self'"
/>
```

### Rationale

**Security & Architecture:**
- Returns to **zero external dependencies** (true client-side-only)
- No external network requests (no DNS lookup, no third-party connections)
- Stricter CSP policy: `font-src 'self'` (removed Google Fonts URLs)
- Perfect alignment with ADR-0001's client-only principle
- Works completely offline after initial page load
- No supply chain risk from external CDN

**Performance:**
- Faster initial load: no external DNS/TLS handshake required
- Controlled caching strategy (fonts bundle with application)
- No render-blocking external requests
- Trade-off: ~580 KB additional bundle size

**User Experience:**
- Same professional Inter + JetBrains Mono typography
- Consistent font rendering across all environments
- Graceful fallbacks to system fonts still available

### Bundle Size Impact

**Source:** [phpied.com web font study](https://www.phpied.com/web-font-file-size-study-a-variable-font-addition/)

- Variable fonts (WOFF2, Latin-extended) median: ~35 KB
- Our implementation: 581 KB total (290 KB + 291 KB)
  - Larger than average due to full character set support
  - Single variable font replaces multiple static weight files
  - Cached after first visit

**Performance context:**
- Typical React app bundle: 200-500 KB (ours is similar)
- ~580 KB fonts = ~4.6 seconds on 1 Mbps, ~600ms on 8 Mbps (4G)
- Modern broadband (25+ Mbps): negligible impact
- **Major benefit:** No external connection latency (DNS + TLS handshake often adds 200-500ms)

Net result: **Better performance in most scenarios** despite larger bundle.

### What Changed From Amendment #1

| Aspect | Amendment #1 (CDN) | Amendment #2 (Self-hosted) |
|--------|-------------------|---------------------------|
| Font source | fonts.gstatic.com | `/fonts/` (self) |
| CSP `font-src` | `'self' https://fonts.gstatic.com` | `'self'` |
| CSP `style-src` | `'self' 'unsafe-inline' https://fonts.googleapis.com` | `'self' 'unsafe-inline'` |
| External requests | 2-3 (CSS + fonts) | 0 |
| Bundle size | App only | App + 581 KB fonts |
| Offline support | Requires cache | Full offline support |
| Third-party dependency | Google CDN | None |

### Consequences

**Good:**
- True client-side-only architecture (no external dependencies)
- Stricter security posture (zero external network requests)
- Better performance (no CDN latency)
- Complete offline functionality
- Professional typography maintained
- Ongoing Learning: found way to satisfy both UX and security

**Acceptable Trade-offs:**
- Larger initial bundle (~580 KB) but cached after first visit
- Manual font updates required (vs automatic CDN updates)

**Neutral:**
- Font rendering quality identical
- Design system unchanged

### Lesson Learned

**On Iterative Decision-Making:**

This amendment demonstrates the iterative process:

1. **Amendment #1** explored professional typography via CDN (industry-standard approach)
2. **Amendment #2** discovered this could achieve both professional UX *and* strict security
3. The CDN exploration was valuable because it validated the typography choices before committing to self-hosting

### Testing

To verify self-hosted fonts work correctly:

```bash
npm run dev
# Check browser DevTools Network tab:
# - Verify fonts load from /fonts/ (not googleapis.com)
# - Verify no CSP violations in console
# - Verify typography renders correctly
```

### Related Decisions

- [ADR-0001: Client-only Processing](./0001-client-only-processing.md) - Core principle: no external dependencies
- [ADR-0002: No Data Persistence](./0002-no-data-persistence.md) - Part of overall security strategy
- Amendment #1 (above) - Initial typography implementation via CDN

### References

- [phpied.com: Web Font File Size Study](https://www.phpied.com/web-font-file-size-study-a-variable-font-addition/)
- [MDN: Using @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)
- [MDN: Variable Fonts Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide)
- [Inter Variable Font](https://github.com/rsms/inter)
- [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono)
