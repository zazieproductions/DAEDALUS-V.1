# Security

DAEDALUS // OS is a static client application. It has no accounts, no API, and no secrets.

## What it does in the browser

- Reads `window.location.search` for `skipBoot` / `boot=skip`
- Writes to the Clipboard when the user clicks COPY in SYNTH
- Renders Canvas 2D and DOM
- Loads JetBrains Mono from Google Fonts

It does **not** store credentials, talk to a backend, or persist user content.

## Reporting

If you find a vulnerability in the static deployment (for example a compromised GitHub Actions workflow or a supply-chain issue in a dependency), email the maintainer via GitHub at [zazieproductions](https://github.com/zazieproductions) or open a private security advisory on this repository.

Please do not file public issues for exploitable CI/supply-chain findings.

## Scope that is out

- Diegetic copy that *claims* network or audio capabilities
- XSS in manifesto text: the manifesto is a React-controlled textarea rendered as the user’s own input in the same origin; it is not `dangerouslySetInnerHTML`
- “Hacking the OS” as fiction — that is the work, not a bounty
