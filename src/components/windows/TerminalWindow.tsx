import { useState, useRef, useEffect } from 'react';
import { useOSStore } from '../../lib/store';
import { commands } from '../../lib/terminal';
import { colors } from '../../config/theme';

export default function TerminalWindow() {
  const terminalLines = useOSStore((s) => s.terminalLines);
  const addTerminalLine = useOSStore((s) => s.addTerminalLine);
  const clearTerminal = useOSStore((s) => s.clearTerminal);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addTerminalLine(`polymath@daedalus:~$ ${input}`);
    setHistory((h) => [input, ...h]);
    setHistIdx(-1);

    const parts = input.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (cmd === 'clear') {
      clearTerminal();
    } else if (commands[cmd]) {
      commands[cmd](args).forEach((line) => addTerminalLine(line));
    } else {
      addTerminalLine(`nous: command not found: ${cmd}`);
      addTerminalLine('Type "help" for available commands.');
    }
    addTerminalLine('');
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIdx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(newIdx);
      if (history[newIdx]) setInput(history[newIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIdx = Math.max(histIdx - 1, -1);
      setHistIdx(newIdx);
      setInput(newIdx >= 0 ? history[newIdx] : '');
    }
  };

  return (
    <div
      className="h-full flex flex-col p-3 font-mono text-xs"
      style={{ color: colors.phosphor, background: 'rgba(0,0,0,0.3)' }}
    >
      <div className="flex-1 overflow-auto space-y-0.5">
        {terminalLines.map((line, i) => (
          <div
            key={i}
            className="whitespace-pre-wrap break-all leading-relaxed"
            style={{
              color: line.startsWith('[')
                ? colors.phosphorDim
                : line.startsWith('polymath')
                  ? colors.teal
                  : colors.phosphor,
            }}
          >
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 mt-2 pt-2"
        style={{ borderTop: '1px solid #1a3a2a' }}
      >
        <span style={{ color: colors.teal }}>polymath@daedalus:~$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none font-mono text-xs"
          style={{ color: colors.phosphor, caretColor: colors.phosphor }}
          autoFocus
          spellCheck={false}
          aria-label="terminal input"
        />
        <span className="animate-pulse">█</span>
      </form>
    </div>
  );
}
