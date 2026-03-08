import React from 'react';
import { Composition, getInputProps } from 'remotion';
import { MainComposition } from '@video-studio/video-templates';
import type { Project } from '@video-studio/video-core';

// Default props for Remotion Studio / composition registration
const defaultProject: Project = {
  id: 'preview',
  name: 'Preview',
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  meta: {
    purpose: 'ad',
    platform: 'tiktok',
    visualStyle: 'clean-saas',
    toneOfVoice: 'professional',
    language: 'he',
    motionIntensity: 'moderate',
    defaultTransition: 'fade',
    defaultAnimation: 'fade-in',
    subtitleMode: false,
    voiceoverRequired: false,
    backgroundMusicRequired: true,
  },
  brandKit: {
    logoPlacement: 'top-right',
    primaryColor: '#6366f1',
    secondaryColor: '#a5b4fc',
    accentColor: '#f59e0b',
    backgroundColor: '#0f172a',
    textColor: '#f8fafc',
    fontHeading: 'Inter',
    fontBody: 'Inter',
  },
  videoSettings: {
    width: 1080,
    height: 1920,
    fps: 30,
    durationInFrames: 300,
    aspectRatio: '9:16',
  },
  scenes: [],
  audioTracks: [],
  captionSettings: { enabled: false, mode: 'sentence' },
  renderSettings: {
    codec: 'h264',
    pixelFormat: 'yuv420p',
    crf: 18,
    audioBitrate: '192k',
    concurrency: 2,
  },
};

/**
 * Wrapper that bridges Remotion's Record<string, unknown> inputProps
 * to MainComposition's typed props, avoiding unsafe type assertions.
 */
const MainCompositionWrapper: React.FC<Record<string, unknown>> = (props) => {
  const inputProps = getInputProps();
  const project = (inputProps?.project ?? props?.project ?? defaultProject) as Project;
  return <MainComposition project={project} />;
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="main"
      component={MainCompositionWrapper}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ project: defaultProject }}
    />
  );
};

export default RemotionRoot;
