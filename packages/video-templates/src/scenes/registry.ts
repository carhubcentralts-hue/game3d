import React from 'react';
import type { SceneType } from '@video-studio/shared';
import type { SceneProps } from '../components/SceneBase.js';
import { HeroIntroScene } from './HeroIntro.js';
import { BigHeadlineScene } from './BigHeadline.js';
import { FeatureGridScene } from './FeatureGrid.js';
import { CtaOutroScene } from './CtaOutro.js';
import { KpiCardsScene } from './KpiCards.js';
import { SocialProofScene } from './SocialProof.js';
import { GenericScene } from './GenericScene.js';

const SCENE_COMPONENTS: Partial<Record<SceneType, React.FC<SceneProps>>> = {
  'hero-intro': HeroIntroScene,
  'big-headline': BigHeadlineScene,
  'feature-grid': FeatureGridScene,
  'cta-outro': CtaOutroScene,
  'kpi-cards': KpiCardsScene,
  'social-proof': SocialProofScene,
};

export function getSceneComponent(type: SceneType): React.FC<SceneProps> {
  return SCENE_COMPONENTS[type] ?? GenericScene;
}
