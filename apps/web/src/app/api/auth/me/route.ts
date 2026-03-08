import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getSessionSecret } from '../../../../lib/session-secret';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('prosaas_session')?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const secret = getSessionSecret();
    const { payload } = await jwtVerify(token, secret);
    return NextResponse.json({
      authenticated: true,
      userId: payload.userId,
      username: payload.username,
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
