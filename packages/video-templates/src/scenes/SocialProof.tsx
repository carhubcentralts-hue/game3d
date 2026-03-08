import React from 'react';
import { AbsoluteFill } from 'remotion';
import { type SceneProps, useSceneAnimations } from '../components/SceneBase.js';

export const SocialProofScene: React.FC<SceneProps> = ({ scene, brandKit }) => {
  const { fadeIn, fadeOut, enterProgress, slideUp } = useSceneAnimations(scene.durationInFrames);
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
      <div
        style={{
          transform: `translateY(${slideUp}px)`,
          textAlign: 'center',
          maxWidth: '85%',
        }}
      >
        <div
          style={{
            fontSize: 60,
            marginBottom: 24,
            opacity: enterProgress,
          }}
        >
          ★★★★★
        </div>
        {scene.headline && (
          <blockquote
            style={{
              fontSize: 36,
              fontStyle: 'italic',
              color: textColor,
              fontFamily: brandKit?.fontBody ?? 'Inter, sans-serif',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            &ldquo;{scene.headline}&rdquo;
          </blockquote>
        )}
        {scene.subheadline && (
          <p
            style={{
              fontSize: 24,
              color: 'rgba(255,255,255,0.6)',
              marginTop: 20,
              fontFamily: brandKit?.fontBody ?? 'Inter, sans-serif',
            }}
          >
            — {scene.subheadline}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};
