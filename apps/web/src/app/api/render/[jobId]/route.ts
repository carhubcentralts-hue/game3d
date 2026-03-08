import { NextRequest, NextResponse } from 'next/server';

const RENDER_SERVICE_URL = process.env.RENDER_SERVICE_URL ?? 'http://localhost:4010';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const response = await fetch(`${RENDER_SERVICE_URL}/render/${encodeURIComponent(jobId)}`);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Render service unavailable';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
