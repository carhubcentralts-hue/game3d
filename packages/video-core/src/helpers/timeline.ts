import type { Project, Scene } from '../schemas/index.js';
import { FPS } from '@video-studio/shared';

/**
 * Recalculates scene start frames so scenes play back-to-back
 * with no gaps or overlaps.
 */
export function normalizeTimeline(scenes: Scene[]): Scene[] {
  let currentFrame = 0;
  return scenes.map((scene) => {
    const normalized = { ...scene, startFrame: currentFrame };
    currentFrame += scene.durationInFrames;
    return normalized;
  });
}

/**
 * Calculates total project duration based on its scenes.
 */
export function calculateTotalDuration(scenes: Scene[]): number {
  return scenes.reduce((total, s) => total + s.durationInFrames, 0);
}

/**
 * Converts seconds to frames at the project FPS.
 */
export function secondsToFrames(seconds: number, fps: number = FPS): number {
  return Math.round(seconds * fps);
}

/**
 * Converts frames to seconds at the project FPS.
 */
export function framesToSeconds(frames: number, fps: number = FPS): number {
  return frames / fps;
}

/**
 * Creates a new empty project with sensible defaults.
 */
export function createEmptyProject(name: string): Project {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    meta: {
      purpose: 'ad',
      platform: 'tiktok',
      visualStyle: 'clean-saas',
      toneOfVoice: 'professional',
      language: 'he',
      motionIntensity: 'moderate',
      defaultTransition: 'fade',
      defaultAnimation: 'fade-in',
      subtitleMode: false,
      voiceoverRequired: false,
      backgroundMusicRequired: true,
    },
    brandKit: {
      logoPlacement: 'top-right',
      primaryColor: '#6366f1',
      secondaryColor: '#a5b4fc',
      accentColor: '#f59e0b',
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
      fontHeading: 'Inter',
      fontBody: 'Inter',
    },
    videoSettings: {
      width: 1080,
      height: 1920,
      fps: 30,
      durationInFrames: 300,
      aspectRatio: '9:16',
    },
    scenes: [],
    audioTracks: [],
    captionSettings: {
      enabled: false,
      mode: 'sentence',
    },
    renderSettings: {
      codec: 'h264',
      pixelFormat: 'yuv420p',
      crf: 18,
      audioBitrate: '192k',
      concurrency: 2,
    },
  };
}
