import React from 'react';
import { AbsoluteFill } from 'remotion';
import { type SceneProps, useSceneAnimations } from '../components/SceneBase.js';

export const HeroIntroScene: React.FC<SceneProps> = ({ scene, brandKit }) => {
  const { fadeIn, fadeOut, slideUp, enterProgress } = useSceneAnimations(scene.durationInFrames);
  const bg = brandKit?.backgroundColor ?? scene.background.value;
  const textColor = brandKit?.textColor ?? '#ffffff';
  const primaryColor = brandKit?.primaryColor ?? '#6366f1';

  return (
    <AbsoluteFill
      style={{
        background: scene.background.type === 'gradient' ? scene.background.value : bg,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fadeIn * fadeOut,
      }}
    >
      <div
        style={{
          transform: `translateY(${slideUp}px) scale(${0.8 + enterProgress * 0.2})`,
          textAlign: 'center',
          padding: '0 60px',
        }}
      >
        {scene.headline && (
          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: textColor,
              fontFamily: brandKit?.fontHeading ?? 'Inter, sans-serif',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {scene.headline}
          </h1>
        )}
        {scene.subheadline && (
          <p
            style={{
              fontSize: 32,
              color: primaryColor,
              fontFamily: brandKit?.fontBody ?? 'Inter, sans-serif',
              marginTop: 24,
              opacity: enterProgress,
            }}
          >
            {scene.subheadline}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};
