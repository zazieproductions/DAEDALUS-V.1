import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from '@/App';
import '@/styles/global.css';

/**
 * Application entry point.
 *
 * Fails loudly if the mount node is missing: a blank screen with a clear
 * console error beats a blank screen with none.
 */
const container = document.getElementById('root');

if (!container) {
  throw new Error(
    'DAEDALUS could not boot: no #root element found in index.html. ' +
      'Check that the mount point has not been renamed.',
  );
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
