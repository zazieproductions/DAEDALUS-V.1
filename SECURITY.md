# Security Policy

## Threat surface

DAEDALUS // OS is a static, client-only application. It is worth being precise
about what that means, because it rules out most of what a security policy
usually covers:

- **No backend.** There is no server, no database, no API.
- **No authentication.** There are no accounts, sessions or tokens.
- **No secrets.** Every environment variable is build-time and non-sensitive;
  `.env.example` documents the complete set.
- **No persistence.** Nothing is written to `localStorage`, `sessionStorage`,
  IndexedDB or cookies. The OS boots identically every time, deliberately.
- **No telemetry.** No analytics, no session recording, no beacons. Vendor
  instrumentation that shipped in an earlier export was removed — see
  [`docs/decisions/0004-remove-vendor-telemetry.md`](docs/decisions/0004-remove-vendor-telemetry.md).
- **One third-party request at runtime:** the JetBrains Mono stylesheet from
  Google Fonts. The interface degrades gracefully to a system monospace face if
  it is blocked.

What remains in scope: cross-site scripting through user input (the terminal
and the manifesto editor both accept free text — both render it as text, never
as HTML), dependency vulnerabilities, and supply-chain issues in the build.

## Supported versions

The `main` branch is the only supported version.

## Reporting a vulnerability

Please report privately rather than opening a public issue:

1. Use GitHub's [private vulnerability reporting][gh] on this repository, or
2. Open a minimal public issue asking for a private channel, without details.

Please include a description, reproduction steps and the affected files. You
can expect an acknowledgement within seven days.

[gh]: https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability
