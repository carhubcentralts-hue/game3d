import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { SignJWT } from 'jose';
import { getSessionSecret } from '../../../../lib/session-secret';

// Hardcoded credentials (in production, check against DB)
const VALID_USERNAME = 'Prosaas';
const VALID_PASSWORD_HASH = createHash('sha256').update('Sd@090702').digest('hex');

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

function verifyPassword(password: string, hash: string): boolean {
  const passwordHash = hashPassword(password);
  if (passwordHash.length !== hash.length) return false;
  let result = 0;
  for (let i = 0; i < passwordHash.length; i++) {
    result |= passwordHash.charCodeAt(i) ^ hash.charCodeAt(i);
  }
  return result === 0;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body as { username?: string; password?: string };

    if (!username || !password) {
      return NextResponse.json(
        { error: 'שם משתמש וסיסמה נדרשים' },
        { status: 400 }
      );
    }

    // Validate credentials
    if (username !== VALID_USERNAME || !verifyPassword(password, VALID_PASSWORD_HASH)) {
      return NextResponse.json(
        { error: 'שם משתמש או סיסמה שגויים' },
        { status: 401 }
      );
    }

    // Create JWT session
    const secret = getSessionSecret();
    const token = await new SignJWT({ userId: 'user_1', username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    // Set cookie
    const response = NextResponse.json({ success: true, username });
    response.cookies.set('prosaas_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'שגיאת שרת' }, { status: 500 });
  }
}
