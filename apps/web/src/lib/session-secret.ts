/**
 * Returns the JWT signing secret as a Uint8Array.
 * Falls back to a dev-only secret if SESSION_SECRET is not set.
 */
export function getSessionSecret(): Uint8Array {
  const raw = process.env.SESSION_SECRET ?? 'dev-secret-change-me';
  return new TextEncoder().encode(raw);
}
