// FIX vs Gemini:
// 1. Position synced on ALL 3 axes (x, y, z) not just y
// 2. useKeyboard NOT called here — it's passed via droneRef from Scene
// 3. No new THREE.Vector3 inside useFrame
// 4. Camera follow implemented here with proper lerp

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Pre-allocate scratch vectors outside component (avoid GC pressure in frame loop)
const _targetPos = new THREE.Vector3();
const _camTarget = new THREE.Vector3();
const _vel = new THREE.Vector3();

const SPEED = 5;
const FRICTION = 0.88;
const BOUNDARY = 10.5;

export function Drone({ keysRef, mobileRef, onPositionChange }) {
  const groupRef = useRef();
  const bodyRef = useRef();
  const thrusterGlowRef = useRef();

  // Own velocity state (pre-allocated)
  const velocity = useRef(new THREE.Vector3());
  const position = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(({ camera, clock }, delta) => {
    const k = keysRef.current;
    const m = mobileRef.current;
    const isMoving =
      k.forward || k.backward || k.left || k.right ||
      m.forward || m.backward || m.left   || m.right;

    // Accumulate input into velocity
    _vel.set(0, 0, 0);
    if (k.forward  || m.forward)  _vel.z -= 1;
    if (k.backward || m.backward) _vel.z += 1;
    if (k.left     || m.left)     _vel.x -= 1;
    if (k.right    || m.right)    _vel.x += 1;

    if (_vel.lengthSq() > 0) {
      _vel.normalize().multiplyScalar(SPEED * delta);
      velocity.current.add(_vel);
    }

    // Apply friction
    velocity.current.multiplyScalar(FRICTION);

    // Move
    position.current.x = Math.max(-BOUNDARY, Math.min(BOUNDARY, position.current.x + velocity.current.x));
    position.current.z = Math.max(-BOUNDARY, Math.min(BOUNDARY, position.current.z + velocity.current.z));

    // Hover bobbing on Y
    position.current.y = 0.5 + Math.sin(clock.elapsedTime * 2) * 0.05;

    // Sync group position (FIX: all 3 axes, not just Y)
    if (groupRef.current) {
      groupRef.current.position.x = position.current.x;
      groupRef.current.position.y = position.current.y;
      groupRef.current.position.z = position.current.z;
    }

    // Tilt body in movement direction
    if (bodyRef.current) {
      bodyRef.current.rotation.x = THREE.MathUtils.lerp(
        bodyRef.current.rotation.x,
        (k.forward || m.forward) ? 0.2 : (k.backward || m.backward) ? -0.2 : 0,
        0.1,
      );
      bodyRef.current.rotation.z = THREE.MathUtils.lerp(
        bodyRef.current.rotation.z,
        (k.left || m.left) ? 0.15 : (k.right || m.right) ? -0.15 : 0,
        0.1,
      );
      // Slow yaw rotation when idle
      if (!isMoving) {
        bodyRef.current.rotation.y += 0.005;
      }
    }

    // Thruster glow intensity
    if (thrusterGlowRef.current) {
      thrusterGlowRef.current.intensity = isMoving ? 1.5 + Math.sin(clock.elapsedTime * 20) * 0.5 : 0.3;
    }

    // --- CAMERA FOLLOW ---
    // Pull camera slightly further back when moving (speed feel)
    const speedMag = velocity.current.length();
    const camZ = 9 + speedMag * 8;
    const camY = 4 + speedMag * 2;

    _camTarget.set(
      position.current.x * 0.3,   // slight lag on X for cinematic feel
      position.current.y + camY,
      position.current.z + camZ,
    );
    camera.position.lerp(_camTarget, 0.06);

    // Look slightly ahead of drone (not directly at it)
    _targetPos.set(
      position.current.x,
      position.current.y - 0.5,
      position.current.z - 2,
    );
    camera.lookAt(_targetPos);

    // FOV widens slightly when moving fast
    camera.fov = THREE.MathUtils.lerp(camera.fov, isMoving ? 62 : 55, 0.05);
    camera.updateProjectionMatrix();

    // Notify parent of position (for proximity detection)
    if (onPositionChange) {
      onPositionChange(position.current.x, position.current.z);
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={bodyRef}>
        {/* Main fuselage */}
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.22, 1.1]} />
          <meshStandardMaterial color="#c0c0d0" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Cockpit dome - the "friendly eye" */}
        <mesh position={[0, 0.18, 0.28]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial
            color="#00E5FF"
            emissive="#00E5FF"
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Left wing */}
        <mesh position={[-0.65, 0, 0.1]}>
          <boxGeometry args={[0.5, 0.06, 0.7]} />
          <meshStandardMaterial color="#aaaabc" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Right wing */}
        <mesh position={[0.65, 0, 0.1]}>
          <boxGeometry args={[0.5, 0.06, 0.7]} />
          <meshStandardMaterial color="#aaaabc" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Thruster nozzle */}
        <mesh position={[0, 0, -0.62]}>
          <cylinderGeometry args={[0.13, 0.18, 0.22, 16]} />
          <meshStandardMaterial color="#333344" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Thruster exhaust glow (point light) */}
        <pointLight
          ref={thrusterGlowRef}
          position={[0, 0, -0.8]}
          color="#FF6030"
          intensity={0.3}
          distance={3}
        />
      </group>

      {/* Body ambient glow */}
      <pointLight position={[0, 0.3, 0]} color="#00E5FF" intensity={0.4} distance={4} />
    </group>
  );
}
