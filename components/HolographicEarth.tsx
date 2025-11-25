import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Stars, useGLTF, Center, Resize, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { SharedStateRef } from '../types';

// Add type definitions for React Three Fiber elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      group: any;
      primitive: any;
    }
  }
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        ambientLight: any;
        pointLight: any;
        group: any;
        primitive: any;
      }
    }
  }
}

interface HolographicEarthProps {
  sharedState: SharedStateRef;
  modelUrl?: string;
}

// Sub-component to handle GLTF loading hook safely
const ExternalModel = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  
  useLayoutEffect(() => {
    // Material Enhancement System
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.frustumCulled = false;
        if (child.material) {
           child.material.side = THREE.DoubleSide;
           child.material.envMapIntensity = 3.0; 
           if (child.material.emissiveMap || (child.material.emissive && (child.material.emissive.r > 0 || child.material.emissive.g > 0 || child.material.emissive.b > 0))) {
               child.material.emissiveIntensity = 5.0; 
               child.material.toneMapped = false; 
           }
        }
      }
    });
  }, [scene]);

  return (
    <group>
        <Resize scale={3.5}>
            <Center>
                <primitive object={scene} />
            </Center>
        </Resize>
    </group>
  );
};

const HolographicEarth: React.FC<HolographicEarthProps> = ({ sharedState, modelUrl }) => {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const LERP_FACTOR = 0.1;
  const SCALE_SPEED = 0.05;
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 3.0;

  useFrame(() => {
    if (!groupRef.current) return;

    const state = sharedState.current;

    // --- ROTATION ---
    state.rotation.x += (state.targetRotation.x - state.rotation.x) * LERP_FACTOR;
    state.rotation.y += (state.targetRotation.y - state.rotation.y) * LERP_FACTOR;

    groupRef.current.rotation.x = state.rotation.x;
    groupRef.current.rotation.y = state.rotation.y;

    // --- SCALING (ZOOM) ---
    // Update target scale based on gesture
    if (state.gesture === 'OPEN') {
        state.targetScale = Math.min(state.targetScale + SCALE_SPEED, MAX_SCALE);
    } else if (state.gesture === 'CLOSED') {
        state.targetScale = Math.max(state.targetScale - SCALE_SPEED, MIN_SCALE);
    }

    // Interpolate scale
    state.scale += (state.targetScale - state.scale) * LERP_FACTOR;
    groupRef.current.scale.set(state.scale, state.scale, state.scale);

    // Pulse effect for the glow
    if (glowRef.current) {
      const time = Date.now() * 0.001;
      const pulse = 1.2 + Math.sin(time) * 0.02;
      glowRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  // Materials for procedural fallback
  const surfaceMaterial = useMemo(() => new THREE.MeshPhongMaterial({
    color: 0x001133,
    emissive: 0x002244,
    specular: 0x111111,
    shininess: 10,
    transparent: true,
    opacity: 0.9,
  }), []);

  const wireframeMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
  }), []);

  const atmosphereMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0x00aaff,
    transparent: true,
    opacity: 0.1,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  }), []);

  return (
    <>
      <ambientLight intensity={1.5} color="#ffffff" />
      <pointLight position={[20, 10, 20]} intensity={2.0} color="#ffffff" />
      <pointLight position={[-20, -10, -10]} intensity={1.0} color="#00aaff" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <group ref={groupRef}>
        {modelUrl ? (
          <>
            <Environment preset="city" background={false} environmentIntensity={1.5} />
            <ExternalModel url={modelUrl} />
          </>
        ) : (
          <group>
            <Sphere args={[2, 64, 64]}>
              <primitive object={surfaceMaterial} attach="material" />
            </Sphere>
            <Sphere args={[2.02, 32, 32]}>
              <primitive object={wireframeMaterial} attach="material" />
            </Sphere>
            <Sphere ref={glowRef} args={[2.2, 32, 32]}>
               <primitive object={atmosphereMaterial} attach="material" />
            </Sphere>
          </group>
        )}
      </group>
    </>
  );
};

export default HolographicEarth;