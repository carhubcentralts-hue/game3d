import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { z } from 'zod';
import { ProjectSchema } from '@video-studio/video-core';
import { renderVideo } from './renderer.js';
import { logger } from './logger.js';

const PORT = Number(process.env.RENDER_PORT ?? 4010);

const RenderRequestSchema = z.object({
  project: ProjectSchema,
  outputDir: z.string().optional(),
});

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

const server = createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/render') {
    try {
      const body = await readBody(req);
      const parsed = RenderRequestSchema.parse(JSON.parse(body));
      logger.info({ projectId: parsed.project.id }, 'Render request received');
      const result = await renderVideo(parsed.project, parsed.outputDir);
      sendJson(res, 200, { success: true, ...result });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ error: message }, 'Render failed');
      sendJson(res, 400, { success: false, error: message });
    }
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    sendJson(res, 200, { status: 'ok', timestamp: new Date().toISOString() });
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  logger.info(`Render service listening on http://localhost:${PORT}`);
});
