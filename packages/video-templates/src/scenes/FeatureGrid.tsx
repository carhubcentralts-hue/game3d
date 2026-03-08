import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { type SceneProps, useSceneAnimations } from '../components/SceneBase.js';

export const FeatureGridScene: React.FC<SceneProps> = ({ scene, brandKit }) => {
  const frame = useCurrentFrame();
  const { fadeIn, fadeOut } = useSceneAnimations(scene.durationInFrames);
  const items = scene.bullets ?? ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'];
  const bg = brandKit?.backgroundColor ?? scene.background.value;
  const textColor = brandKit?.textColor ?? '#ffffff';
  const primaryColor = brandKit?.primaryColor ?? '#6366f1';

  return (
    <AbsoluteFill
      style={{
        background: bg,
        padding: 60,
        opacity: fadeIn * fadeOut,
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {scene.headline && (
        <h2
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: textColor,
            fontFamily: brandKit?.fontHeading ?? 'Inter, sans-serif',
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          {scene.headline}
        </h2>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
        }}
      >
        {items.map((item, i) => {
          const delay = i * 8;
          const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const translateY = interpolate(frame, [delay, delay + 12], [20, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: '24px 20px',
                opacity,
                transform: `translateY(${translateY}px)`,
                borderLeft: `3px solid ${primaryColor}`,
              }}
            >
              <span
                style={{
                  color: textColor,
                  fontSize: 24,
                  fontFamily: brandKit?.fontBody ?? 'Inter, sans-serif',
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
