import { NextRequest, NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'node:crypto';
import { SignJWT } from 'jose';
import { getSessionSecret } from '../../../../lib/session-secret';

// In production, validate against DB via UserRepository.
// For now, credentials are checked against a server-side hash.
const VALID_USERNAME = process.env.AUTH_USERNAME ?? 'Prosaas';
const VALID_PASSWORD_HASH = process.env.AUTH_PASSWORD_HASH
  ?? createHash('sha256').update('Sd@090702').digest('hex');

function verifyPassword(password: string, hash: string): boolean {
  const passwordHash = createHash('sha256').update(password).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(passwordHash, 'hex'), Buffer.from(hash, 'hex'));
  } catch {
    return false;
  }
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
