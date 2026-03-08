import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { type SceneProps, useSceneAnimations } from '../components/SceneBase.js';

export const KpiCardsScene: React.FC<SceneProps> = ({ scene, brandKit }) => {
  const frame = useCurrentFrame();
  const { fadeIn, fadeOut } = useSceneAnimations(scene.durationInFrames);
  const items = scene.bullets ?? ['100K+', '50%', '24/7', '5★'];
  const bg = brandKit?.backgroundColor ?? scene.background.value;
  const textColor = brandKit?.textColor ?? '#ffffff';
  const accentColor = brandKit?.primaryColor ?? '#f59e0b';

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
      {scene.headline && (
        <h2
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: textColor,
            textAlign: 'center',
            marginBottom: 40,
            fontFamily: brandKit?.fontHeading ?? 'Inter, sans-serif',
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
          width: '100%',
        }}
      >
        {items.map((item, i) => {
          const delay = i * 10;
          const scale = interpolate(frame, [delay, delay + 15], [0.5, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 20,
                padding: 32,
                textAlign: 'center',
                transform: `scale(${scale})`,
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 900,
                  color: accentColor,
                  fontFamily: brandKit?.fontHeading ?? 'Inter, sans-serif',
                }}
              >
                {item}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
