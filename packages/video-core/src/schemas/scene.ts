import { z } from 'zod';
import {
  SCENE_TYPES,
  TRANSITION_STYLES,
  ANIMATION_PRESETS,
} from '@video-studio/shared';

export const MediaItemSchema = z.object({
  id: z.string(),
  type: z.enum(['image', 'video', 'lottie', 'svg']),
  src: z.string(),
  alt: z.string().optional(),
  fit: z.enum(['cover', 'contain', 'fill']).default('cover'),
  position: z
    .object({
      x: z.number().default(0),
      y: z.number().default(0),
      width: z.number().default(100),
      height: z.number().default(100),
    })
    .optional(),
});

export type MediaItem = z.infer<typeof MediaItemSchema>;

export const OverlaySchema = z.object({
  id: z.string(),
  type: z.enum(['shape', 'gradient', 'pattern', 'image']),
  opacity: z.number().min(0).max(1).default(0.5),
  color: z.string().optional(),
  gradient: z.string().optional(),
});

export type Overlay = z.infer<typeof OverlaySchema>;

export const CaptionBlockSchema = z.object({
  text: z.string(),
  startFrame: z.number().int().min(0),
  endFrame: z.number().int().min(0),
  style: z
    .object({
      fontSize: z.number().optional(),
      color: z.string().optional(),
      background: z.string().optional(),
      position: z.enum(['top', 'center', 'bottom']).optional(),
    })
    .optional(),
});

export type CaptionBlock = z.infer<typeof CaptionBlockSchema>;

export const SceneSchema = z.object({
  id: z.string(),
  type: z.enum(SCENE_TYPES),
  startFrame: z.number().int().min(0),
  durationInFrames: z.number().int().min(1),
  background: z
    .object({
      type: z.enum(['solid', 'gradient', 'image', 'video']),
      value: z.string(),
    })
    .default({ type: 'solid', value: '#000000' }),
  layout: z.enum(['centered', 'left', 'right', 'split', 'grid', 'fullscreen']).default('centered'),
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  mediaItems: z.array(MediaItemSchema).default([]),
  overlays: z.array(OverlaySchema).default([]),
  cta: z
    .object({
      text: z.string(),
      style: z.enum(['button', 'text', 'banner']).default('button'),
      color: z.string().optional(),
    })
    .optional(),
  motionPreset: z.enum(ANIMATION_PRESETS).default('fade-in'),
  transitionIn: z.enum(TRANSITION_STYLES).default('cut'),
  transitionOut: z.enum(TRANSITION_STYLES).default('cut'),
  audioCue: z.string().optional(),
  captionBlock: CaptionBlockSchema.optional(),
  styleOverrides: z.record(z.string(), z.unknown()).optional(),
});

export type Scene = z.infer<typeof SceneSchema>;
