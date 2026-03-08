import { join } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import type { Project } from '@video-studio/video-core';
import { logger } from './logger.js';

const STORAGE_ROOT = process.env.STORAGE_ROOT ?? join(process.cwd(), '..', '..', 'storage');
const TEMP_DIR = join(STORAGE_ROOT, 'temp');

export interface RenderProgress {
  progress: number;
  status: string;
}

export interface RenderResult {
  outputPath: string;
  durationInFrames: number;
  width: number;
  height: number;
  fps: number;
  isStub?: boolean;
}

/**
 * Render a video project to MP4 using Remotion.
 *
 * This runs locally on the machine. In the future, the same service
 * can be deployed to a remote server — the web app just changes
 * RENDER_SERVICE_URL in its env.
 *
 * Flow:
 * 1. Bundle the Remotion composition (webpack)
 * 2. Select the 'main' composition with the project data as input props
 * 3. Render to MP4 using renderMedia
 * 4. Return the output path
 */
export async function renderVideo(
  project: Project,
  outputDir?: string,
  onProgress?: (p: RenderProgress) => void,
): Promise<RenderResult> {
  const renderDir = outputDir ?? join(STORAGE_ROOT, 'renders');
  await mkdir(renderDir, { recursive: true });
  await mkdir(TEMP_DIR, { recursive: true });

  const filename = `${project.id}-${Date.now()}.mp4`;
  const outputPath = join(renderDir, filename);

  const totalFrames = project.scenes.reduce(
    (sum: number, s: { durationInFrames: number }) => sum + s.durationInFrames,
    0,
  );
  const fps = project.videoSettings.fps;
  const width = project.videoSettings.width;
  const height = project.videoSettings.height;

  logger.info(
    {
      projectId: project.id,
      scenes: project.scenes.length,
      totalFrames,
      resolution: `${width}x${height}`,
      fps,
      codec: project.renderSettings.codec,
      outputPath,
    },
    'Starting Remotion render',
  );

  onProgress?.({ progress: 0, status: 'bundling' });

  try {
    // Dynamic imports — these are heavy dependencies
    const { bundle } = await import('@remotion/bundler');
    const { renderMedia, selectComposition } = await import('@remotion/renderer');

    // Step 1: Bundle the Remotion entry point
    const entryPoint = join(import.meta.dirname ?? __dirname, 'remotion-entry.js');

    logger.info({ entryPoint }, 'Bundling Remotion composition...');
    const bundled = await bundle({
      entryPoint,
      onProgress: (percent: number) => {
        onProgress?.({ progress: Math.round(percent * 0.2), status: 'bundling' });
      },
    });
    logger.info('Bundle complete');
    onProgress?.({ progress: 20, status: 'preparing' });

    // Step 2: Select composition with project data
    const composition = await selectComposition({
      serveUrl: bundled,
      id: 'main',
      inputProps: { project },
    });

    // Override duration/resolution from project settings
    const compositionWithOverrides = {
      ...composition,
      width,
      height,
      fps,
      durationInFrames: totalFrames || project.videoSettings.durationInFrames,
    };

    logger.info(
      {
        compositionId: compositionWithOverrides.id,
        durationInFrames: compositionWithOverrides.durationInFrames,
        width: compositionWithOverrides.width,
        height: compositionWithOverrides.height,
      },
      'Composition selected, starting render...',
    );

    onProgress?.({ progress: 25, status: 'rendering' });

    // Step 3: Render to MP4
    const codecMap: Record<string, 'h264' | 'h265' | 'vp8' | 'vp9'> = {
      h264: 'h264',
      h265: 'h265',
      vp8: 'vp8',
      vp9: 'vp9',
    };

    await renderMedia({
      composition: compositionWithOverrides,
      serveUrl: bundled,
      codec: codecMap[project.renderSettings.codec] ?? 'h264',
      outputLocation: outputPath,
      crf: project.renderSettings.crf,
      concurrency: project.renderSettings.concurrency,
      onProgress: ({ progress }: { progress: number }) => {
        const percent = 25 + Math.round(progress * 70);
        onProgress?.({ progress: percent, status: 'rendering' });
        if (Math.round(progress * 100) % 10 === 0) {
          logger.info({ progress: `${Math.round(progress * 100)}%` }, 'Render progress');
        }
      },
    });

    onProgress?.({ progress: 100, status: 'complete' });

    logger.info({ outputPath, totalFrames }, 'Render complete!');

    return {
      outputPath,
      durationInFrames: totalFrames || project.videoSettings.durationInFrames,
      width,
      height,
      fps,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    // If Remotion is not installed, fall back to stub
    if (message.includes('Cannot find module') || message.includes('ERR_MODULE_NOT_FOUND')) {
      logger.warn(
        'Remotion renderer not installed. Returning stub result. ' +
          'Install @remotion/bundler and @remotion/renderer for real rendering.',
      );
      onProgress?.({ progress: 100, status: 'complete (stub)' });
      return {
        outputPath,
        isStub: true,
        durationInFrames: totalFrames || project.videoSettings.durationInFrames,
        width,
        height,
        fps,
      };
    }

    logger.error({ error: message }, 'Render failed');
    throw error;
  }
}
