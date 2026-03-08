import type { Scene } from '@video-studio/video-core';
import type { SceneType, VideoPurpose, VisualStyle, MotionIntensity } from '@video-studio/shared';
import { SCENE_TYPES } from '@video-studio/shared';

export interface PromptInput {
  text: string;
  purpose: VideoPurpose;
  visualStyle: VisualStyle;
  motionIntensity: MotionIntensity;
  sceneCount: number;
  durationSeconds: number;
  fps: number;
  language: string;
}

interface SceneTemplate {
  type: SceneType;
  headlineKey: string;
  defaultDurationRatio: number;
}

const PURPOSE_TEMPLATES: Record<string, SceneTemplate[]> = {
  ad: [
    { type: 'hero-intro', headlineKey: 'hook', defaultDurationRatio: 0.15 },
    { type: 'problem-solution', headlineKey: 'problem', defaultDurationRatio: 0.2 },
    { type: 'feature-grid', headlineKey: 'features', defaultDurationRatio: 0.2 },
    { type: 'social-proof', headlineKey: 'proof', defaultDurationRatio: 0.15 },
    { type: 'offer-discount', headlineKey: 'offer', defaultDurationRatio: 0.15 },
    { type: 'cta-outro', headlineKey: 'cta', defaultDurationRatio: 0.15 },
  ],
  explainer: [
    { type: 'hero-intro', headlineKey: 'title', defaultDurationRatio: 0.15 },
    { type: 'big-headline', headlineKey: 'what', defaultDurationRatio: 0.15 },
    { type: 'timeline-steps', headlineKey: 'how', defaultDurationRatio: 0.25 },
    { type: 'feature-grid', headlineKey: 'features', defaultDurationRatio: 0.2 },
    { type: 'kpi-cards', headlineKey: 'results', defaultDurationRatio: 0.1 },
    { type: 'cta-outro', headlineKey: 'cta', defaultDurationRatio: 0.15 },
  ],
  'saas-promo': [
    { type: 'hero-intro', headlineKey: 'intro', defaultDurationRatio: 0.15 },
    { type: 'mockup-showcase', headlineKey: 'product', defaultDurationRatio: 0.2 },
    { type: 'feature-grid', headlineKey: 'features', defaultDurationRatio: 0.2 },
    { type: 'kpi-cards', headlineKey: 'metrics', defaultDurationRatio: 0.15 },
    { type: 'social-proof', headlineKey: 'testimonial', defaultDurationRatio: 0.15 },
    { type: 'cta-outro', headlineKey: 'cta', defaultDurationRatio: 0.15 },
  ],
};

/**
 * Simple keyword extraction from prompt text.
 */
function extractKeywords(text: string): string[] {
  return text
    .split(/[\s,;.!?]+/)
    .filter((w) => w.length > 2)
    .slice(0, 20);
}

/**
 * Select which scene templates to use based on purpose and requested count.
 */
function selectSceneTemplates(purpose: VideoPurpose, count: number): SceneTemplate[] {
  const templates = PURPOSE_TEMPLATES[purpose] ?? PURPOSE_TEMPLATES['ad']!;
  if (count >= templates.length) return templates;
  // Keep first and last, sample from middle
  const result: SceneTemplate[] = [templates[0]!];
  const middle = templates.slice(1, -1);
  const needed = count - 2;
  for (let i = 0; i < Math.max(0, needed); i++) {
    result.push(middle[i % middle.length]!);
  }
  result.push(templates[templates.length - 1]!);
  return result;
}

/**
 * Converts a free-text prompt into a structured array of scenes.
 */
export function generateScenes(input: PromptInput): Scene[] {
  const totalFrames = input.durationSeconds * input.fps;
  const templates = selectSceneTemplates(input.purpose, input.sceneCount);
  const keywords = extractKeywords(input.text);

  let usedFrames = 0;
  const scenes: Scene[] = templates.map((template, index) => {
    const isLast = index === templates.length - 1;
    const durationInFrames = isLast
      ? totalFrames - usedFrames
      : Math.round(totalFrames * template.defaultDurationRatio);
    usedFrames += durationInFrames;

    return {
      id: crypto.randomUUID(),
      type: template.type,
      startFrame: 0, // Will be normalized
      durationInFrames: Math.max(1, durationInFrames),
      background: { type: 'solid' as const, value: '#0f172a' },
      layout: 'centered' as const,
      headline: keywords[index % keywords.length] ?? template.headlineKey,
      subheadline: input.text.slice(0, 80),
      mediaItems: [],
      overlays: [],
      motionPreset: 'fade-in' as const,
      transitionIn: index === 0 ? ('cut' as const) : ('fade' as const),
      transitionOut: 'fade' as const,
    };
  });

  return scenes;
}
