import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import type { Scene } from '@video-studio/video-core';

export interface SceneProps {
  scene: Scene;
  brandKit?: {
    primaryColor?: string;
    textColor?: string;
    backgroundColor?: string;
    fontHeading?: string;
    fontBody?: string;
  };
}

/**
 * Shared animation helpers used across scene components.
 */
export function useSceneAnimations(durationInFrames: number) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120, mass: 0.8 },
  });

  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const slideUp = interpolate(frame, [0, 20], [40, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return { frame, enterProgress, fadeIn, fadeOut, slideUp };
}
