/**
 * Capture production screenshots of DAEDALUS // OS.
 *
 * Usage:
 *   npm run build
 *   npx playwright install chromium
 *   npm run capture
 *
 * Falls back to puppeteer-core + a local Chrome/Chromium if Playwright
 * browsers are not installed (PUPPETEER_EXECUTABLE_PATH or @sparticuz/chromium).
 *
 * Writes:
 *   docs/images/project-preview.png
 *   docs/images/project-active.png
 *   docs/images/project-detail.png
 *   docs/images/github-social-preview.png
 *   public/og.png
 */
import { spawn } from 'node:child_process';
import { mkdir, copyFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imagesDir = join(root, 'docs', 'images');
const publicDir = join(root, 'public');

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function findFreePort(port) {
  return new Promise((resolve) => {
    const server = createServer();
    server.unref();
    server.on('error', () => resolve(findFreePort(port + 1)));
    server.listen(port, '127.0.0.1', () => {
      const addr = server.address();
      server.close(() => resolve(addr.port));
    });
  });
}

async function startPreview() {
  const port = await findFreePort(4173);
  const child = spawn(
    'npx',
    ['vite', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
    {
      cwd: root,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, BASE_PATH: '/' },
    },
  );

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('vite preview timed out')), 20000);
    const onData = (buf) => {
      const text = buf.toString();
      if (text.includes('Local:') || text.includes('http://')) {
        clearTimeout(timer);
        resolve();
      }
    };
    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.on('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`vite preview exited with ${code}`));
    });
  });

  return { child, origin: `http://127.0.0.1:${port}` };
}

async function launchPlaywright() {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  return {
    engine: 'playwright',
    browser,
    page,
    async setViewport(width, height) {
      await page.setViewportSize({ width, height });
    },
    async screenshot(opts) {
      return page.screenshot(opts);
    },
    async close() {
      await browser.close();
    },
  };
}

async function launchPuppeteer() {
  const puppeteer = (await import('puppeteer-core')).default;
  let executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH;
  let args = ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars', '--font-render-hinting=none'];

  if (!executablePath) {
    try {
      const spxMod = await import('@sparticuz/chromium');
      const spx = spxMod.default;
      const inflate = spxMod.inflate;
      const setupLambdaEnvironment = spxMod.setupLambdaEnvironment;
      const { join } = await import('node:path');
      const bin = join(root, 'node_modules/@sparticuz/chromium/bin');
      try {
        const libRoot = await inflate(join(bin, 'al2023.tar.br'));
        setupLambdaEnvironment(join(libRoot, 'lib'));
      } catch {
        /* Amazon Linux extras are optional on hosts that already have nss */
      }
      executablePath = await spx.executablePath();
      args = [...spx.args, '--hide-scrollbars'];
    } catch {
      throw new Error(
        'No Chromium found. Run: npx playwright install chromium\n' +
          'or set PUPPETEER_EXECUTABLE_PATH to a Chrome binary.',
      );
    }
  }

  const browser = await puppeteer.launch({
    executablePath,
    args,
    headless: 'shell',
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  page.setDefaultTimeout(15000);
  return {
    engine: 'puppeteer',
    browser,
    page,
    async setViewport(width, height) {
      await page.setViewport({ width, height, deviceScaleFactor: 2 });
    },
    async screenshot(opts) {
      return page.screenshot(opts);
    },
    async close() {
      await browser.close();
    },
  };
}

async function launchBrowser() {
  try {
    const session = await launchPlaywright();
    console.log('browser: playwright');
    return session;
  } catch (err) {
    console.log('playwright unavailable:', err instanceof Error ? err.message : err);
    const session = await launchPuppeteer();
    console.log('browser: puppeteer-core');
    return session;
  }
}

async function clickTitle(page, title) {
  await page.click(`[title="${title}"]`);
}

async function typeCommand(page, command) {
  await page.click('input[aria-label="terminal input"]');
  await page.keyboard.type(command);
  await page.keyboard.press('Enter');
}

async function injectBrandBar(page, { top } = {}) {
  await page.evaluate((topPx) => {
    const existing = document.getElementById('__social-brand');
    if (existing) existing.remove();
    const bar = document.createElement('div');
    bar.id = '__social-brand';
    const pos = topPx == null ? 'bottom:0' : `top:${topPx}px;bottom:auto`;
    bar.style.cssText = [
      'position:fixed',
      'left:0',
      'right:0',
      pos,
      'height:56px',
      'display:flex',
      'align-items:center',
      'justify-content:space-between',
      'padding:0 28px',
      'background:linear-gradient(180deg, rgba(10,10,20,0) 0%, rgba(10,10,20,0.92) 40%, #0a0a14 100%)',
      'font-family:"JetBrains Mono", ui-monospace, monospace',
      'pointer-events:none',
      'z-index:2147483647',
    ].join(';');
    bar.innerHTML = `
      <span style="color:#00ff88;letter-spacing:0.28em;font-size:12px;font-weight:700;">DAEDALUS // OS</span>
      <span style="color:#8888aa;letter-spacing:0.18em;font-size:10px;">ZAZIE PRODUCTIONS</span>
    `;
    document.body.appendChild(bar);
  }, top);
}

async function main() {
  await mkdir(imagesDir, { recursive: true });
  await mkdir(publicDir, { recursive: true });

  const { child, origin } = await startPreview();
  let session;
  try {
    session = await launchBrowser();
    const { page } = session;

    await page.goto(`${origin}/?skipBoot=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-dock]');
    await wait(2000);

    const previewPath = join(imagesDir, 'project-preview.png');
    await session.screenshot({ path: previewPath, fullPage: false });
    console.log('wrote', previewPath);

    const graphBox = await page.evaluate(() => {
      const el = document.querySelector('[data-window="graph"]');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    if (!graphBox) throw new Error('knowledge graph window not found');
    const detailPath = join(imagesDir, 'project-detail.png');
    await session.screenshot({
      path: detailPath,
      clip: {
        x: Math.max(0, graphBox.x - 8),
        y: Math.max(0, graphBox.y - 8),
        width: Math.min(1440 - graphBox.x + 8, graphBox.width + 16),
        height: Math.min(900 - graphBox.y + 8, graphBox.height + 16),
      },
    });
    console.log('wrote', detailPath);

    await injectBrandBar(page, { top: 584 });
    const socialPath = join(imagesDir, 'github-social-preview.png');
    await session.screenshot({
      path: socialPath,
      fullPage: false,
      clip: { x: 0, y: 0, width: 1280, height: 640 },
    });
    console.log('wrote', socialPath);
    await page.evaluate(() => document.getElementById('__social-brand')?.remove());

    await typeCommand(page, 'neofetch');
    await wait(500);
    await typeCommand(page, 'matrix');
    await wait(400);

    await clickTitle(page, 'ORACLE // DIVINATION');
    await wait(400);
    await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('button')];
      const cast = buttons.find((b) => (b.textContent || '').includes('CAST YARROW STALKS'));
      if (cast) cast.click();
    });
    await wait(1400);

    await page.evaluate(() => {
      const chip = [...document.querySelectorAll('[data-window="cortex"] button')].find(
        (b) => (b.textContent || '').trim() === 'PHIL',
      );
      if (chip) chip.click();
    });
    await wait(900);

    const activePath = join(imagesDir, 'project-active.png');
    await session.screenshot({ path: activePath, fullPage: false });
    console.log('wrote', activePath);

    await copyFile(socialPath, join(publicDir, 'og.png'));
    console.log('wrote', join(publicDir, 'og.png'));
    process.exitCode = 0;
  } finally {
    if (session) await session.close();
    child.kill('SIGKILL');
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
