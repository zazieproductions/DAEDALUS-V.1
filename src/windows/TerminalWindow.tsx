import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';

import { accent } from '@/config/theme';
import { TERMINAL_PROMPT } from '@/data/terminal-content';
import { runCommand } from '@/features/terminal/commands';
import { useOSStore } from '@/store/osStore';

/** Colour a transcript line by what kind of line it is. */
function lineColor(line: string): string {
  if (line.startsWith('[')) return '#00cc66'; // system output
  if (line.startsWith('polymath')) return '#4ecdc4'; // echoed input
  return accent.signal; // everything else
}

/**
 * TERMINAL // νοῦς — the shell.
 *
 * The component is deliberately thin: it owns the input, the command history
 * and the scroll position, and nothing else. Parsing and execution live in
 * `@/features/terminal/commands`, which is a pure module with no React
 * dependency — that is what makes the whole command set unit-testable.
 *
 * The transcript lives in the store rather than local state so it survives
 * being docked and restored.
 */
export function TerminalWindow() {
  const transcript = useOSStore((store) => store.terminalLines);
  const appendTerminalLines = useOSStore((store) => store.appendTerminalLines);
  const clearTerminal = useOSStore((store) => store.clearTerminal);

  const [input, setInput] = useState('');
  /** Most recent command first. */
  const [history, setHistory] = useState<string[]>([]);
  /** -1 means "editing a fresh line". */
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    const result = runCommand(input);

    if (result.clearScreen) {
      clearTerminal();
    } else {
      appendTerminalLines([`${TERMINAL_PROMPT} ${input}`, ...result.lines, '']);
    }

    setHistory((previous) => [input, ...previous]);
    setHistoryIndex(-1);
    setInput('');
  };

  /** Up/down walk the command history, shell-style. */
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const nextIndex = Math.min(historyIndex + 1, history.length - 1);
      if (nextIndex < 0) return;
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex] ?? '');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(nextIndex);
      setInput(nextIndex >= 0 ? (history[nextIndex] ?? '') : '');
    }
  };

  return (
    <div
      className="h-full flex flex-col p-3 font-mono text-xs"
      style={{ color: accent.signal, background: 'rgba(0,0,0,0.3)' }}
    >
      <output className="flex-1 overflow-auto space-y-0.5 block" aria-live="polite">
        {transcript.map((line, index) => (
          <div
            key={`${index}-${line}`}
            className="whitespace-pre-wrap break-all leading-relaxed"
            style={{ color: lineColor(line) }}
          >
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </output>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 mt-2 pt-2"
        style={{ borderTop: '1px solid #1a3a2a' }}
      >
        <label htmlFor="terminal-input" style={{ color: '#4ecdc4' }}>
          {TERMINAL_PROMPT}
        </label>
        <input
          id="terminal-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none font-mono text-xs"
          style={{ color: accent.signal, caretColor: accent.signal }}
          autoComplete="off"
          spellCheck={false}
          // Intentional: the terminal is the OS's primary surface, and the
          // desktop mounts straight after the boot sequence — you should be
          // able to start typing without hunting for the caret.
          autoFocus
          aria-label="Terminal command input"
        />
        <span className="animate-pulse" aria-hidden>
          █
        </span>
      </form>
    </div>
  );
}

export default TerminalWindow;
