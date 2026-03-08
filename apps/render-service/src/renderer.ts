import { join } from 'node:path';
import { mkdir } from 'node:fs/promises';
import type { Project } from '@video-studio/video-core';
import { logger } from './logger.js';

const STORAGE_ROOT = process.env.STORAGE_ROOT ?? join(process.cwd(), '..', '..', 'storage');

/**
 * Render a video project to MP4.
 *
 * In the full implementation this uses @remotion/renderer's bundle(),
 * selectComposition(), and renderMedia() APIs. Since Remotion renderer
 * requires a Webpack bundle step and browser environment, this
 * placeholder writes the render config and returns the expected output path.
 *
 * To enable full rendering, install @remotion/bundler and @remotion/renderer
 * and replace this stub with the real pipeline.
 */
export async function renderVideo(
  project: Project,
  outputDir?: string,
): Promise<{ outputPath: string; durationInFrames: number }> {
  const renderDir = outputDir ?? join(STORAGE_ROOT, 'renders');
  await mkdir(renderDir, { recursive: true });

  const filename = `${project.id}-${Date.now()}.mp4`;
  const outputPath = join(renderDir, filename);
  const totalFrames = project.scenes.reduce((sum, s) => sum + s.durationInFrames, 0);

  logger.info(
    {
      projectId: project.id,
      scenes: project.scenes.length,
      totalFrames,
      outputPath,
      codec: project.renderSettings.codec,
    },
    'Rendering video (stub — install @remotion/renderer for real output)',
  );

  // TODO: Replace with actual Remotion rendering pipeline:
  // 1. const bundled = await bundle({ entryPoint, webpackOverride });
  // 2. const composition = await selectComposition({ serveUrl: bundled, id: 'main', inputProps: { project } });
  // 3. await renderMedia({ composition, serveUrl: bundled, codec: 'h264', outputLocation: outputPath });

  return { outputPath, durationInFrames: totalFrames };
}
