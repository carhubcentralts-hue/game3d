import { createHash } from 'node:crypto';

export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  const passwordHash = hashPassword(password);
  // Constant-time comparison to prevent timing attacks
  if (passwordHash.length !== hash.length) return false;
  let result = 0;
  for (let i = 0; i < passwordHash.length; i++) {
    result |= passwordHash.charCodeAt(i) ^ hash.charCodeAt(i);
  }
  return result === 0;
}
