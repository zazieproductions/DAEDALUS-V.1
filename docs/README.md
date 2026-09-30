# DAEDALUS // OS — documentation

Start here. The root [`README.md`](../README.md) covers what the project is and
how to run it; this directory covers how it works and why it is built the way
it is.

## Map

| Document                                           | For                                                                         |
| -------------------------------------------------- | --------------------------------------------------------------------------- |
| [architecture.md](architecture.md)                 | The system at a glance: layers, data flow, module boundaries, render cycle. |
| [window-system.md](window-system.md)               | How the registry-driven window manager works, and how to add a window.      |
| [simulations.md](simulations.md)                   | The canvas systems and the metric random walk, with their actual maths.     |
| [terminal.md](terminal.md)                         | Command reference and how to extend the shell.                              |
| [creative-methodology.md](creative-methodology.md) | Why these ten windows, and what each one argues.                            |
| [development.md](development.md)                   | Daily workflow, conventions, scripts, testing strategy.                     |
| [deployment.md](deployment.md)                     | Building and hosting, including GitHub Pages and sub-path deploys.          |
| [troubleshooting.md](troubleshooting.md)           | Known rough edges and what to do about them.                                |
| [roadmap.md](roadmap.md)                           | What is built, what is planned, what is speculative.                        |
| [decisions/](decisions/)                           | Architecture decision records — the reasoning behind the structure.         |

## Reading paths

**"I want to understand the code in ten minutes."**
[architecture.md](architecture.md) → [window-system.md](window-system.md).

**"I want to add something."**
[development.md](development.md) → [window-system.md](window-system.md) →
[`CONTRIBUTING.md`](../CONTRIBUTING.md).

**"I care about the ideas, not the implementation."**
[creative-methodology.md](creative-methodology.md) →
[roadmap.md](roadmap.md).

**"I'm evaluating this as engineering work."**
[decisions/](decisions/) → [simulations.md](simulations.md) → the tests in
[`tests/`](../tests).
