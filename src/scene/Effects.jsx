// Post-processing effects: Bloom + Vignette + ChromaticAberration
// These are the effects that make the sci-fi neon look REAL

import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';

// Pre-allocated to avoid GC in render loop
const _chromaticOffset = new Vector2(0.0005, 0.0005);

export function Effects() {
  return (
    <EffectComposer multisampling={4}>
      {/* Bloom: makes emissive materials glow dramatically */}
      <Bloom
        intensity={0.8}
        luminanceThreshold={0.3}
        luminanceSmoothing={0.6}
        mipmapBlur
      />

      {/* Vignette: darkens edges, adds cinematic depth */}
      <Vignette
        offset={0.4}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />

      {/* Subtle chromatic aberration for that CRT/hologram feel */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={_chromaticOffset}
      />
    </EffectComposer>
  );
}
