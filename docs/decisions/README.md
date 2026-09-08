# Architecture decision records

Short, dated notes on decisions that shaped the codebase — kept so that the
reasoning survives longer than the memory of it, and so a future contributor
can tell "deliberate" from "accidental".

Format: context → decision → consequences. One file per decision, numbered,
never rewritten once accepted (superseded records get a successor instead).

| #                                                        | Decision                                              | Status   |
| -------------------------------------------------------- | ----------------------------------------------------- | -------- |
| [0001](0001-registry-driven-window-system.md)            | A declarative manifest drives the window system       | Accepted |
| [0002](0002-zustand-kernel-no-persistence.md)            | One Zustand store as the kernel; nothing is persisted | Accepted |
| [0003](0003-pure-simulations-separate-from-rendering.md) | Simulations are pure and separate from rendering      | Accepted |
| [0004](0004-remove-vendor-telemetry.md)                  | Vendor telemetry removed from `index.html`            | Accepted |
| [0005](0005-corpus-as-data-modules.md)                   | Authored content lives in `src/data/`, not components | Accepted |
