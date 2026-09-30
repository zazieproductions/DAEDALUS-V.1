import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '@/App';
import { WINDOW_REGISTRY } from '@/config/windows';
import { useOSStore } from '@/store/osStore';

/**
 * Shell smoke tests.
 *
 * These are deliberately behavioural rather than snapshot-based: they assert
 * that the desktop is *operable* (windows dock and restore, the shell reacts,
 * the terminal answers) without freezing the visual design in place. The look
 * of DAEDALUS is meant to keep evolving; the mechanics are not.
 */
function bootDesktop() {
  useOSStore.setState(useOSStore.getInitialState(), true);
  useOSStore.setState({ bootComplete: true });
  return render(<App />);
}

describe('desktop shell', () => {
  beforeEach(() => {
    useOSStore.setState(useOSStore.getInitialState(), true);
  });

  it('shows the boot sequence before the desktop exists', () => {
    render(<App />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: /open windows/i })).not.toBeInTheDocument();
  });

  it('renders one dock launcher per registered window', () => {
    bootDesktop();

    const dock = screen.getByRole('navigation', { name: /open windows/i });
    expect(within(dock).getAllByRole('button')).toHaveLength(WINDOW_REGISTRY.length);
  });

  it('only renders windows that are not docked', () => {
    bootDesktop();

    const open = WINDOW_REGISTRY.filter((descriptor) => !descriptor.startsMinimised);
    const docked = WINDOW_REGISTRY.filter((descriptor) => descriptor.startsMinimised);

    for (const descriptor of open) {
      expect(screen.getByRole('region', { name: descriptor.title })).toBeInTheDocument();
    }
    for (const descriptor of docked) {
      expect(screen.queryByRole('region', { name: descriptor.title })).not.toBeInTheDocument();
    }
  });

  it('docks and restores a window from its chrome and the dock', async () => {
    const user = userEvent.setup();
    bootDesktop();

    const terminal = WINDOW_REGISTRY[0];
    await user.click(screen.getByRole('button', { name: `Minimise ${terminal.title}` }));
    expect(screen.queryByRole('region', { name: terminal.title })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: `Open ${terminal.title}` }));
    expect(screen.getByRole('region', { name: terminal.title })).toBeInTheDocument();
  });

  it('maximises and restores a window', async () => {
    const user = userEvent.setup();
    bootDesktop();

    const library = WINDOW_REGISTRY.find((descriptor) => descriptor.id === 'library')!;
    await user.click(screen.getByRole('button', { name: `Maximise ${library.title}` }));

    expect(useOSStore.getState().windows.library.maximised).toBe(true);

    await user.click(screen.getByRole('button', { name: `Restore ${library.title}` }));
    expect(useOSStore.getState().windows.library.maximised).toBe(false);
    expect(useOSStore.getState().windows.library.x).toBe(library.defaultGeometry.x);
  });

  it('renders the four telemetry readouts', () => {
    bootDesktop();

    for (const label of [
      'Genius quotient',
      'Polymath index',
      'Obscurity rating',
      'Creative pulse',
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });
});

describe('terminal window', () => {
  it('answers a command and echoes the input', async () => {
    const user = userEvent.setup();
    bootDesktop();

    const input = screen.getByRole('textbox', { name: /terminal command input/i });
    await user.type(input, 'whoami{Enter}');

    expect(screen.getByText(/UID: ∞/)).toBeInTheDocument();
    expect(screen.getByText(/polymath@daedalus:~\$ whoami/)).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('recalls history with the up arrow', async () => {
    const user = userEvent.setup();
    bootDesktop();

    const input = screen.getByRole('textbox', { name: /terminal command input/i });
    await user.type(input, 'haiku{Enter}');
    await user.type(input, '{ArrowUp}');

    expect(input).toHaveValue('haiku');
  });

  it('reports unknown commands without crashing the window', async () => {
    const user = userEvent.setup();
    bootDesktop();

    const input = screen.getByRole('textbox', { name: /terminal command input/i });
    await user.type(input, 'nonsense{Enter}');

    expect(screen.getByText(/command not found: nonsense/)).toBeInTheDocument();
  });
});

describe('library window', () => {
  it('filters the shelf as you type', async () => {
    const user = userEvent.setup();
    bootDesktop();

    const search = screen.getByRole('textbox', { name: /search books/i });
    await user.type(search, 'nabokov');

    expect(screen.getByText('Pale Fire')).toBeInTheDocument();
    expect(screen.queryByText('Cybernetics')).not.toBeInTheDocument();
    expect(screen.getByText(/1 volumes/)).toBeInTheDocument();
  });
});
