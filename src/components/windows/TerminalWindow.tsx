import { useState, useRef, useEffect } from 'react';
import { useOSStore, obscureQuotes } from '../../lib/store';
import { glitchText } from '../../lib/utils';

const commands: Record<string, (args: string[]) => string[]> = {
  help: () => [
    '╔══════════════════════════════════════════════╗',
    '║  DAEDALUS TERMINAL // Available Commands     ║',
    '╠══════════════════════════════════════════════╣',
    '║  help      — Display this message            ║',
    '║  quote     — Channel the noosphere           ║',
    '║  status    — System diagnostics               ║',
    '║  think     — Generate a thought               ║',
    '║  clear     — Clear terminal                   ║',
    '║  whoami    — Identity query                   ║',
    '║  neofetch  — System information               ║',
    '║  matrix    — Enter the matrix                 ║',
    '║  haiku     — Generate a haiku                 ║',
    '║  glitch    — ▓░▒█▀▄                           ║',
    '╚══════════════════════════════════════════════╝',
  ],
  quote: () => [obscureQuotes[Math.floor(Math.random() * obscureQuotes.length)]],
  status: () => [
    '[SYS] All cognitive subsystems: NOMINAL',
    `[MEM] Semantic memory utilization: ${(70 + Math.random() * 25).toFixed(1)}%`,
    `[CPU] Ideation throughput: ${(1000 + Math.random() * 9000).toFixed(0)} concepts/sec`,
    `[NET] Noosphere latency: ${(1 + Math.random() * 5).toFixed(1)}ms`,
    '[GPU] Qualia renderer: ACTIVE',
    `[IO]  Synesthetic channels: ${Math.floor(7 + Math.random() * 5)} active`,
  ],
  whoami: () => [
    'polymath@daedalus:~$',
    'UID: ∞  GID: creative-genius',
    'Groups: autodidact, flâneur, bricoleur, aesthete',
    'Shell: /bin/nous',
    'Home: /dev/imagination',
    `Uptime: ${Math.floor(Math.random() * 10000)} days of continuous learning`,
  ],
  think: () => {
    const thoughts = [
      'What if we modeled economic systems as cellular automata on a Riemannian manifold?',
      'The isomorphism between musical fugues and recursive algorithms suggests a deeper structure...',
      'Consider: every great artwork is a proof by construction of an aesthetic theorem.',
      'Language is a virus from outer space. — Burroughs. But what is the host?',
      'If we treat cities as organisms, what are their dreams?',
      'The boundary between mathematics and poetry dissolves at sufficient abstraction.',
    ];
    return [`[THOUGHT] ${thoughts[Math.floor(Math.random() * thoughts.length)]}`, ''];
  },
  neofetch: () => [
    '     ╔═══╗         polymath@daedalus',
    '     ║ δ ║         ──────────────────',
    '     ╚═══╝         OS: DAEDALUS v7.3.1',
    '    ╱     ╲        Kernel: nous-4.2.0',
    '   ╱  ◊◊◊  ╲       Uptime: ∞',
    '  ╱  ◊◊◊◊◊  ╲      Packages: 47,000 (cross-disciplinary)',
    ' ╱  ◊◊◊◊◊◊◊  ╲     Shell: /bin/nous',
    '╱   ◊◊◊◊◊◊◊   ╲    Resolution: ∞ × ∞',
    '╲   ◊◊◊◊◊◊◊   ╱    WM: Polymathic Desktop',
    ' ╲  ◊◊◊◊◊◊◊  ╱     Theme: Liminal Dark',
    '  ╲  ◊◊◊◊◊  ╱      Icons: Hermetic',
    '   ╲  ◊◊◊  ╱       Terminal: νοῦς',
    '    ╲     ╱        CPU: Neural Substrate @ ∞ GHz',
    '     ╲   ╱         Memory: 847 TB / ∞ TB',
    '      ╲ ╱',
  ],
  matrix: () => {
    const lines: string[] = [];
    for (let i = 0; i < 8; i++) {
      let line = '';
      for (let j = 0; j < 60; j++) {
        line += String.fromCharCode(0x30A0 + Math.random() * 96);
      }
      lines.push(line);
    }
    return lines;
  },
  haiku: () => {
    const haikus = [
      ['Algorithms dream', 'in silicon reverie—', 'consciousness blooms.'],
      ['Between the zeros', 'and ones, a universe', 'of meaning unfolds.'],
      ['The polymath sees', 'connections invisible—', 'everything is one.'],
    ];
    const h = haikus[Math.floor(Math.random() * haikus.length)];
    return ['', ...h, ''];
  },
  glitch: (args) => {
    const text = args.join(' ') || 'THE MEDIUM IS THE MESSAGE';
    return Array.from({ length: 5 }, () => glitchText(text));
  },
};

export default function TerminalWindow() {
  const { terminalLines, addTerminalLine } = useOSStore();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalLines.length === 0) {
      addTerminalLine('DAEDALUS Terminal v7.3.1 — Type "help" for commands');
      addTerminalLine('Connected to noosphere. Latency: 2.3ms');
      addTerminalLine('');
    }
  }, []);

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
      useOSStore.setState({ terminalLines: [] });
    } else if (commands[cmd]) {
      const output = commands[cmd](args);
      output.forEach((line) => addTerminalLine(line));
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
    <div className="h-full flex flex-col p-3 font-mono text-xs" style={{ color: '#00ff88', background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex-1 overflow-auto space-y-0.5">
        {terminalLines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-all leading-relaxed" style={{ color: line.startsWith('[') ? '#00cc66' : line.startsWith('polymath') ? '#4ecdc4' : '#00ff88' }}>
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2 pt-2" style={{ borderTop: '1px solid #1a3a2a' }}>
        <span style={{ color: '#4ecdc4' }}>polymath@daedalus:~$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none font-mono text-xs"
          style={{ color: '#00ff88', caretColor: '#00ff88' }}
          autoFocus
          spellCheck={false}
        />
        <span className="animate-pulse">█</span>
      </form>
    </div>
  );
}
