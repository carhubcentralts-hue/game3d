import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { ProjectSchema } from '@video-studio/video-core';
import { renderVideo, type RenderProgress } from './renderer.js';
import { logger } from './logger.js';

const PORT = Number(process.env.RENDER_PORT ?? 4010);

// ── Request Schemas ──────────────────────────────────
const RenderRequestSchema = z.object({
  project: ProjectSchema,
  outputDir: z.string().optional(),
  jobId: z.string().optional(),
});

// ── In-memory job store (future: DB-backed) ──────────
interface RenderJobState {
  id: string;
  projectId: string;
  status: 'pending' | 'bundling' | 'rendering' | 'complete' | 'failed';
  progress: number;
  logs: string[];
  outputPath?: string;
  error?: string;
  startedAt: string;
  completedAt?: string;
}

const jobs = new Map<string, RenderJobState>();

// ── Helpers ──────────────────────────────────────────
function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function setCors(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function generateJobId(): string {
  return `rj_${randomUUID()}`;
}

// ── URL parsing helper ───────────────────────────────
function matchRoute(url: string, pattern: string): Record<string, string> | null {
  const urlParts = url.split('/').filter(Boolean);
  const patternParts = pattern.split('/').filter(Boolean);
  if (urlParts.length !== patternParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = urlParts[i];
    } else if (patternParts[i] !== urlParts[i]) {
      return null;
    }
  }
  return params;
}

// ── Server ───────────────────────────────────────────
const server = createServer(async (req, res) => {
  setCors(res);
  const url = (req.url ?? '/').split('?')[0];

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // POST /render — Start a render job
  if (req.method === 'POST' && url === '/render') {
    try {
      const body = await readBody(req);
      const parsed = RenderRequestSchema.parse(JSON.parse(body));

      const jobId = parsed.jobId ?? generateJobId();
      const job: RenderJobState = {
        id: jobId,
        projectId: parsed.project.id,
        status: 'pending',
        progress: 0,
        logs: [],
        startedAt: new Date().toISOString(),
      };
      jobs.set(jobId, job);

      logger.info({ jobId, projectId: parsed.project.id }, 'Render job created');

      // Return immediately with job ID — render runs in background
      sendJson(res, 202, {
        success: true,
        jobId,
        status: 'pending',
        message: 'Render job started',
      });

      // Run render asynchronously
      setImmediate(async () => {
        try {
          job.status = 'bundling';
          job.logs.push(`[${new Date().toISOString()}] Render started`);

          const result = await renderVideo(
            parsed.project,
            parsed.outputDir,
            (p: RenderProgress) => {
              job.progress = p.progress;
              job.status = p.status as RenderJobState['status'];
              job.logs.push(`[${new Date().toISOString()}] ${p.status}: ${p.progress}%`);
            },
          );

          job.status = 'complete';
          job.progress = 100;
          job.outputPath = result.outputPath;
          job.completedAt = new Date().toISOString();
          job.logs.push(`[${new Date().toISOString()}] Render complete: ${result.outputPath}`);

          logger.info({ jobId, outputPath: result.outputPath }, 'Render job complete');
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          job.status = 'failed';
          job.error = message;
          job.completedAt = new Date().toISOString();
          job.logs.push(`[${new Date().toISOString()}] FAILED: ${message}`);

          logger.error({ jobId, error: message }, 'Render job failed');
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ error: message }, 'Invalid render request');
      sendJson(res, 400, { success: false, error: message });
    }
    return;
  }

  // GET /render/:jobId — Get job status
  const jobMatch = matchRoute(url, '/render/:jobId');
  if (req.method === 'GET' && jobMatch) {
    const job = jobs.get(jobMatch.jobId);
    if (!job) {
      sendJson(res, 404, { error: 'Job not found' });
      return;
    }
    sendJson(res, 200, {
      id: job.id,
      projectId: job.projectId,
      status: job.status,
      progress: job.progress,
      outputPath: job.outputPath,
      error: job.error,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
    });
    return;
  }

  // GET /render/:jobId/logs — Get job logs
  const logsMatch = matchRoute(url, '/render/:jobId/logs');
  if (req.method === 'GET' && logsMatch) {
    const job = jobs.get(logsMatch.jobId);
    if (!job) {
      sendJson(res, 404, { error: 'Job not found' });
      return;
    }
    sendJson(res, 200, { id: job.id, logs: job.logs });
    return;
  }

  // GET /health — Health check
  if (req.method === 'GET' && url === '/health') {
    sendJson(res, 200, {
      status: 'ok',
      service: 'render-service',
      mode: 'local',
      activeJobs: Array.from(jobs.values()).filter(
        (j) => j.status !== 'complete' && j.status !== 'failed',
      ).length,
      totalJobs: jobs.size,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // GET /jobs — List all jobs
  if (req.method === 'GET' && url === '/jobs') {
    const allJobs = Array.from(jobs.values()).map((j) => ({
      id: j.id,
      projectId: j.projectId,
      status: j.status,
      progress: j.progress,
      startedAt: j.startedAt,
      completedAt: j.completedAt,
    }));
    sendJson(res, 200, { jobs: allJobs });
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  logger.info(
    {
      port: PORT,
      mode: 'local',
      message: 'Ready for rendering. Web app connects via RENDER_SERVICE_URL.',
    },
    `Render service listening on http://localhost:${PORT}`,
  );
});
