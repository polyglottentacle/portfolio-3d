// Deep space nebula: two large colored spheres with additive blending
// Creates volumetric atmosphere without performance cost

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending } from 'three';

export function Nebula() {
  const blueRef = useRef();
  const purpleRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.05;
    if (blueRef.current) {
      blueRef.current.rotation.y = t;
      blueRef.current.rotation.z = t * 0.3;
    }
    if (purpleRef.current) {
      purpleRef.current.rotation.y = -t * 0.7;
      purpleRef.current.rotation.x = t * 0.2;
    }
  });

  return (
    <group>
      {/* Blue nebula - behind and above */}
      <mesh ref={blueRef} position={[-20, 10, -40]}>
        <sphereGeometry args={[30, 8, 8]} />
        <meshBasicMaterial
          color="#001a3a"
          transparent
          opacity={0.15}
          blending={AdditiveBlending}
          depthWrite={false}
          side={2}
        />
      </mesh>

      {/* Purple nebula */}
      <mesh ref={purpleRef} position={[25, 5, -35]}>
        <sphereGeometry args={[25, 8, 8]} />
        <meshBasicMaterial
          color="#1a0030"
          transparent
          opacity={0.12}
          blending={AdditiveBlending}
          depthWrite={false}
          side={2}
        />
      </mesh>

      {/* Distant cyan glow (gives the platform its ambient teal hue) */}
      <mesh position={[0, -30, 0]}>
        <sphereGeometry args={[50, 6, 6]} />
        <meshBasicMaterial
          color="#001020"
          transparent
          opacity={0.3}
          depthWrite={false}
          side={2}
        />
      </mesh>
    </group>
  );
}
