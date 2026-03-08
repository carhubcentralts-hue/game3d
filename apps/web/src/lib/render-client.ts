/**
 * Render Client — calls the render service via HTTP.
 *
 * Architecture:
 * - LOCAL: render-service runs on localhost:4010 (your Mac)
 * - REMOTE: same service on a remote server, just change RENDER_SERVICE_URL
 *
 * The web app doesn't care where the render service is — it's just an HTTP call.
 */

const RENDER_SERVICE_URL =
  process.env.RENDER_SERVICE_URL ??
  process.env.NEXT_PUBLIC_RENDER_SERVICE_URL ??
  'http://localhost:4010';

export interface RenderRequest {
  project: unknown;
  jobId?: string;
}

export interface RenderJobStatus {
  id: string;
  projectId: string;
  status: 'pending' | 'bundling' | 'rendering' | 'complete' | 'failed';
  progress: number;
  outputPath?: string;
  error?: string;
  startedAt: string;
  completedAt?: string;
}

export interface RenderJobLogs {
  id: string;
  logs: string[];
}

export interface RenderServiceHealth {
  status: string;
  service: string;
  mode: string;
  activeJobs: number;
  totalJobs: number;
  timestamp: string;
}

class RenderClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = (baseUrl ?? RENDER_SERVICE_URL).replace(/\/$/, '');
  }

  /** Start a render job. Returns immediately with job ID. */
  async startRender(
    request: RenderRequest,
  ): Promise<{ success: boolean; jobId: string; status: string }> {
    const response = await fetch(`${this.baseUrl}/render`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `Request failed with status ${response.status}` }));
      throw new Error(
        (error as { error?: string }).error ?? `Render request failed: ${response.status}`,
      );
    }
    return response.json() as Promise<{ success: boolean; jobId: string; status: string }>;
  }

  /** Get render job status */
  async getJobStatus(jobId: string): Promise<RenderJobStatus> {
    const response = await fetch(`${this.baseUrl}/render/${encodeURIComponent(jobId)}`);
    if (!response.ok) {
      throw new Error(`Failed to get job status: ${response.status}`);
    }
    return response.json() as Promise<RenderJobStatus>;
  }

  /** Get render job logs */
  async getJobLogs(jobId: string): Promise<RenderJobLogs> {
    const response = await fetch(`${this.baseUrl}/render/${encodeURIComponent(jobId)}/logs`);
    if (!response.ok) {
      throw new Error(`Failed to get job logs: ${response.status}`);
    }
    return response.json() as Promise<RenderJobLogs>;
  }

  /** Poll job status until complete or failed */
  async waitForCompletion(
    jobId: string,
    onProgress?: (status: RenderJobStatus) => void,
    intervalMs = 2000,
    timeoutMs = 600000,
  ): Promise<RenderJobStatus> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const status = await this.getJobStatus(jobId);
      onProgress?.(status);

      if (status.status === 'complete' || status.status === 'failed') {
        return status;
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
    throw new Error('Render timed out');
  }

  /** Health check */
  async health(): Promise<RenderServiceHealth> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    return response.json() as Promise<RenderServiceHealth>;
  }
}

// Singleton instance
export const renderClient = new RenderClient();

// Factory for custom URL (e.g., in API routes with server-side env)
export function createRenderClient(baseUrl?: string): RenderClient {
  return new RenderClient(baseUrl);
}
