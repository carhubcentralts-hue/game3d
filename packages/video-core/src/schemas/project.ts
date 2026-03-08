import { z } from 'zod';
import {
  VIDEO_PURPOSES,
  VISUAL_STYLES,
  PLATFORMS,
  TONE_OF_VOICE,
  MOTION_INTENSITIES,
  TRANSITION_STYLES,
  ANIMATION_PRESETS,
  PROJECT_STATUSES,
} from '@video-studio/shared';
import { SceneSchema } from './scene.js';
import { BrandKitSchema } from './brand-kit.js';

export const AudioTrackSchema = z.object({
  id: z.string(),
  type: z.enum(['music', 'voiceover', 'sfx']),
  src: z.string(),
  volume: z.number().min(0).max(1).default(1),
  startFrame: z.number().int().min(0).default(0),
  durationInFrames: z.number().int().min(1).optional(),
  loop: z.boolean().default(false),
});

export type AudioTrack = z.infer<typeof AudioTrackSchema>;

export const CaptionSettingsSchema = z.object({
  enabled: z.boolean().default(false),
  mode: z.enum(['word-by-word', 'sentence', 'line']).default('sentence'),
  style: z
    .object({
      fontSize: z.number().default(32),
      color: z.string().default('#ffffff'),
      background: z.string().default('rgba(0,0,0,0.6)'),
      position: z.enum(['top', 'center', 'bottom']).default('bottom'),
    })
    .optional(),
});

export type CaptionSettings = z.infer<typeof CaptionSettingsSchema>;

export const RenderSettingsSchema = z.object({
  codec: z.enum(['h264', 'h265', 'vp8', 'vp9']).default('h264'),
  pixelFormat: z.enum(['yuv420p', 'yuv422p', 'yuv444p']).default('yuv420p'),
  crf: z.number().int().min(0).max(63).default(18),
  audioBitrate: z.string().default('192k'),
  concurrency: z.number().int().min(1).default(2),
});

export type RenderSettings = z.infer<typeof RenderSettingsSchema>;

export const VideoSettingsSchema = z.object({
  width: z.number().int().min(1).default(1080),
  height: z.number().int().min(1).default(1920),
  fps: z.number().int().min(1).default(30),
  durationInFrames: z.number().int().min(1).default(300),
  aspectRatio: z.string().default('9:16'),
});

export type VideoSettings = z.infer<typeof VideoSettingsSchema>;

export const ProjectMetaSchema = z.object({
  purpose: z.enum(VIDEO_PURPOSES).default('ad'),
  platform: z.enum(PLATFORMS).default('tiktok'),
  visualStyle: z.enum(VISUAL_STYLES).default('clean-saas'),
  toneOfVoice: z.enum(TONE_OF_VOICE).default('professional'),
  language: z.string().default('he'),
  motionIntensity: z.enum(MOTION_INTENSITIES).default('moderate'),
  defaultTransition: z.enum(TRANSITION_STYLES).default('fade'),
  defaultAnimation: z.enum(ANIMATION_PRESETS).default('fade-in'),
  subtitleMode: z.boolean().default(false),
  voiceoverRequired: z.boolean().default(false),
  backgroundMusicRequired: z.boolean().default(true),
});

export type ProjectMeta = z.infer<typeof ProjectMetaSchema>;

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(PROJECT_STATUSES).default('draft'),
  createdAt: z.string(),
  updatedAt: z.string(),
  prompt: z.string().optional(),
  meta: ProjectMetaSchema,
  brandKit: BrandKitSchema,
  videoSettings: VideoSettingsSchema,
  scenes: z.array(SceneSchema).default([]),
  audioTracks: z.array(AudioTrackSchema).default([]),
  captionSettings: CaptionSettingsSchema,
  renderSettings: RenderSettingsSchema,
  thumbnailUrl: z.string().optional(),
  renderOutputPath: z.string().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;
