import React from 'react';
import { AbsoluteFill } from 'remotion';
import { type SceneProps, useSceneAnimations } from '../components/SceneBase.js';

/** Generic fallback scene for types that don't have a dedicated component yet. */
export const GenericScene: React.FC<SceneProps> = ({ scene, brandKit }) => {
  const { fadeIn, fadeOut, slideUp } = useSceneAnimations(scene.durationInFrames);
  const bg = brandKit?.backgroundColor ?? scene.background.value;
  const textColor = brandKit?.textColor ?? '#ffffff';

  return (
    <AbsoluteFill
      style={{
        background: bg,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fadeIn * fadeOut,
        padding: 60,
      }}
    >
      <div style={{ transform: `translateY(${slideUp}px)`, textAlign: 'center' }}>
        {scene.headline && (
          <h1
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: textColor,
              fontFamily: brandKit?.fontHeading ?? 'Inter, sans-serif',
            }}
          >
            {scene.headline}
          </h1>
        )}
        {scene.subheadline && (
          <p
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.7)',
              marginTop: 16,
              fontFamily: brandKit?.fontBody ?? 'Inter, sans-serif',
            }}
          >
            {scene.subheadline}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};
