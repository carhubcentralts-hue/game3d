/**
 * Returns the JWT signing secret as a Uint8Array.
 * In production, SESSION_SECRET must be set — a warning is logged otherwise.
 */
export function getSessionSecret(): Uint8Array {
  const raw = process.env.SESSION_SECRET;
  if (!raw) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET environment variable is required in production');
    }
    console.warn('⚠️  SESSION_SECRET not set — using insecure dev-only fallback');
  }
  return new TextEncoder().encode(raw ?? 'dev-secret-change-me-in-production');
}
