# Content Security Policy Implementation

- **Status:** Accepted
- **Date:** 2025-10-16
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
