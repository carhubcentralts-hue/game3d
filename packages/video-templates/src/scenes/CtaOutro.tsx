import React from 'react';
import { AbsoluteFill } from 'remotion';
import { type SceneProps, useSceneAnimations } from '../components/SceneBase.js';

export const CtaOutroScene: React.FC<SceneProps> = ({ scene, brandKit }) => {
  const { fadeIn, fadeOut, enterProgress, slideUp } = useSceneAnimations(scene.durationInFrames);
  const bg = brandKit?.backgroundColor ?? scene.background.value;
  const textColor = brandKit?.textColor ?? '#ffffff';
  const primaryColor = brandKit?.primaryColor ?? '#6366f1';

  return (
    <AbsoluteFill
      style={{
        background: bg,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fadeIn * fadeOut,
      }}
    >
      <div
        style={{
          textAlign: 'center',
          transform: `translateY(${slideUp}px)`,
        }}
      >
        {scene.headline && (
          <h1
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: textColor,
              fontFamily: brandKit?.fontHeading ?? 'Inter, sans-serif',
              marginBottom: 32,
            }}
          >
            {scene.headline}
          </h1>
        )}
        {scene.cta && (
          <div
            style={{
              display: 'inline-block',
              background: primaryColor,
              color: '#ffffff',
              fontSize: 36,
              fontWeight: 700,
              padding: '20px 48px',
              borderRadius: 16,
              transform: `scale(${0.8 + enterProgress * 0.2})`,
              fontFamily: brandKit?.fontBody ?? 'Inter, sans-serif',
            }}
          >
            {scene.cta.text}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
