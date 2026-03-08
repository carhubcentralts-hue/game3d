import React from 'react';
import { AbsoluteFill } from 'remotion';
import { type SceneProps, useSceneAnimations } from '../components/SceneBase.js';

export const BigHeadlineScene: React.FC<SceneProps> = ({ scene, brandKit }) => {
  const { fadeIn, fadeOut, enterProgress } = useSceneAnimations(scene.durationInFrames);
  const bg = brandKit?.backgroundColor ?? scene.background.value;
  const textColor = brandKit?.textColor ?? '#ffffff';

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
          transform: `scale(${0.5 + enterProgress * 0.5})`,
          textAlign: 'center',
          padding: '0 80px',
        }}
      >
        <h1
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: textColor,
            fontFamily: brandKit?.fontHeading ?? 'Inter, sans-serif',
            lineHeight: 1.05,
          }}
        >
          {scene.headline ?? 'Headline'}
        </h1>
      </div>
    </AbsoluteFill>
  );
};
