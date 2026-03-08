export const ASPECT_RATIOS = {
  '9:16': { width: 1080, height: 1920 },
  '16:9': { width: 1920, height: 1080 },
  '1:1': { width: 1080, height: 1080 },
  '4:5': { width: 1080, height: 1350 },
} as const;

export type AspectRatioKey = keyof typeof ASPECT_RATIOS;

export const PLATFORMS = [
  'tiktok',
  'instagram-reels',
  'instagram-story',
  'youtube-shorts',
  'youtube-16:9',
  'facebook-ad',
  'square-post',
] as const;

export type Platform = (typeof PLATFORMS)[number];

export const VIDEO_PURPOSES = [
  'ad',
  'ugc',
  'saas-promo',
  'explainer',
  'reel',
  'testimonial',
  'offer-ad',
  'kpi-summary',
  'slideshow',
  'cinematic-typography',
] as const;

export type VideoPurpose = (typeof VIDEO_PURPOSES)[number];

export const VISUAL_STYLES = [
  'clean-saas',
  'bold-startup',
  'luxury',
  'dark-premium',
  'minimal',
  'flashy-performance',
] as const;

export type VisualStyle = (typeof VISUAL_STYLES)[number];

export const SCENE_TYPES = [
  'hero-intro',
  'big-headline',
  'split-layout',
  'fullscreen-image',
  'before-after',
  'social-proof',
  'kpi-cards',
  'timeline-steps',
  'feature-grid',
  'problem-solution',
  'offer-discount',
  'cta-outro',
  'mockup-showcase',
  'logo-wall',
  'faq-objection',
] as const;

export type SceneType = (typeof SCENE_TYPES)[number];

export const PROJECT_STATUSES = [
  'draft',
  'ready',
  'rendering',
  'done',
  'failed',
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const TONE_OF_VOICE = [
  'professional',
  'casual',
  'bold',
  'friendly',
  'urgent',
  'luxury',
  'playful',
] as const;

export type ToneOfVoice = (typeof TONE_OF_VOICE)[number];

export const MOTION_INTENSITIES = ['subtle', 'moderate', 'energetic', 'extreme'] as const;

export type MotionIntensity = (typeof MOTION_INTENSITIES)[number];

export const TRANSITION_STYLES = [
  'cut',
  'fade',
  'slide-left',
  'slide-right',
  'slide-up',
  'zoom-in',
  'zoom-out',
  'wipe',
] as const;

export type TransitionStyle = (typeof TRANSITION_STYLES)[number];

export const ANIMATION_PRESETS = [
  'fade-in',
  'slide-up',
  'slide-left',
  'scale-in',
  'bounce-in',
  'typewriter',
  'blur-in',
  'spring-pop',
] as const;

export type AnimationPreset = (typeof ANIMATION_PRESETS)[number];

export const FPS = 30;
