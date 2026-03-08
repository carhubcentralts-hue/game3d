import { NextRequest, NextResponse } from 'next/server';

const RENDER_SERVICE_URL = process.env.RENDER_SERVICE_URL ?? 'http://localhost:4010';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${RENDER_SERVICE_URL}/render`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Render service unavailable';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
