import React from 'react';
import { Sequence, AbsoluteFill } from 'remotion';
import type { Project } from '@video-studio/video-core';
import { getSceneComponent } from './scenes/registry.js';

export interface MainCompositionProps {
  project: Project;
}

export const MainComposition: React.FC<MainCompositionProps> = ({ project }) => {
  const brandKit = project.brandKit;

  return (
    <AbsoluteFill style={{ background: brandKit.backgroundColor }}>
      {project.scenes.map((scene) => {
        const SceneComponent = getSceneComponent(scene.type);
        return (
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            durationInFrames={scene.durationInFrames}
            name={`${scene.type}-${scene.id.slice(0, 8)}`}
          >
            <SceneComponent scene={scene} brandKit={brandKit} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
