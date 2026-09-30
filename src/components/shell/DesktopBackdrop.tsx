import { env } from '@/config/env';
import { surface } from '@/config/theme';

/**
 * Four stacked, non-interactive layers that make the desktop feel like a CRT
 * rather than a web page:
 *
 *   1. a photographic neural field at 15% opacity;
 *   2. three coloured radial washes that keep the corners from going flat;
 *   3. 2px scanlines;
 *   4. a 40px grid at 1% opacity — invisible until you look for it.
 *
 * All four are pure CSS over a single raster asset, so the whole backdrop
 * costs one HTTP request and no JavaScript.
 */
export function DesktopBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${env.basePath}images/neural-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse at 30% 50%, rgba(0,255,136,0.03) 0%, transparent 50%)',
            'radial-gradient(ellipse at 70% 30%, rgba(168,85,247,0.03) 0%, transparent 50%)',
            'radial-gradient(ellipse at 50% 80%, rgba(78,205,196,0.02) 0%, transparent 50%)',
          ].join(', '),
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '40px 40px',
          borderColor: surface.border,
        }}
      />
    </div>
  );
}

export default DesktopBackdrop;
