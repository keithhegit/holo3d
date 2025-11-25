import React, { useRef, useMemo, useLayoutEffect, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, Stars, Html, useGLTF, Center, Resize, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { SharedStateRef, POI, InteractionMode } from '../types';
import { latLonToVector3, calculateAngleToCamera } from '../utils/coordinates';
import POILabel from './POILabel';

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
  pois?: POI[];
  onActivePOIChange?: (poi: POI | null) => void;
  interactionMode: InteractionMode;
}

const EARTH_RADIUS = 2.0;
const TEXTURE_OFFSET_Y = -Math.PI / 2; // Align textures with lat/lon

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

// POI Marker Component
const POIMarker: React.FC<{ poi: POI; isActive: boolean }> = ({ poi, isActive }) => {
  const position = useMemo(() => {
    return latLonToVector3(poi.lat, poi.lon, EARTH_RADIUS + 0.05);
  }, [poi.lat, poi.lon]);

  return (
    <group position={position}>
      <Html
        center
        distanceFactor={15}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: 'auto' }}
      >
        <POILabel poi={poi} isActive={isActive} />
      </Html>
    </group>
  );
};

const HolographicEarth: React.FC<HolographicEarthProps> = ({
  sharedState,
  modelUrl,
  pois = [],
  onActivePOIChange,
  interactionMode
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const [activePOI, setActivePOI] = useState<POI | null>(null);
  const [userInteracting, setUserInteracting] = useState(false);

  const LERP_FACTOR = 0.1;
  const SCALE_SPEED = 0.05;
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 3.0;

  // Auto-rotation configuration
  const AUTO_ROTATE_SPEED = 0.002; // Slow rotation speed
  const AUTO_ROTATE_X = 0.001; // Forward rolling effect
  const AUTO_ROTATE_Y = 0.0005; // Slight sideways drift

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const sharedStateData = sharedState.current;

    // --- AUTO-ROTATION (向前滚动效果) ---
    if (interactionMode === 'classic' && !userInteracting) {
      // Simulate forward rolling by rotating around X axis (tilted)
      groupRef.current.rotation.x += AUTO_ROTATE_X;
      groupRef.current.rotation.y += AUTO_ROTATE_Y;
    }

    // --- GESTURE MODE ROTATION ---
    if (interactionMode === 'gesture') {
      sharedStateData.rotation.x += (sharedStateData.targetRotation.x - sharedStateData.rotation.x) * LERP_FACTOR;
      sharedStateData.rotation.y += (sharedStateData.targetRotation.y - sharedStateData.rotation.y) * LERP_FACTOR;

      groupRef.current.rotation.x = sharedStateData.rotation.x;
      groupRef.current.rotation.y = sharedStateData.rotation.y;

      // --- SCALING (ZOOM) ---
      if (sharedStateData.gesture === 'OPEN') {
        sharedStateData.targetScale = Math.min(sharedStateData.targetScale + SCALE_SPEED, MAX_SCALE);
      } else if (sharedStateData.gesture === 'CLOSED') {
        sharedStateData.targetScale = Math.max(sharedStateData.targetScale - SCALE_SPEED, MIN_SCALE);
      }

      sharedStateData.scale += (sharedStateData.targetScale - sharedStateData.scale) * LERP_FACTOR;
      groupRef.current.scale.set(sharedStateData.scale, sharedStateData.scale, sharedStateData.scale);
    }

    // --- PULSE EFFECT for glow ---
    if (glowRef.current) {
      const time = Date.now() * 0.001;
      const pulse = 1.2 + Math.sin(time) * 0.02;
      glowRef.current.scale.set(pulse, pulse, pulse);
    }

    // --- AUTO-FOCUS POI CALCULATION ---
    if (pois.length > 0) {
      let closestPOI: POI | null = null;
      let minAngle = Infinity;

      pois.forEach((poi) => {
        const poiWorldPos = latLonToVector3(poi.lat, poi.lon, EARTH_RADIUS);

        // Transform to world space
        const worldPos = new THREE.Vector3();
        worldPos.copy(poiWorldPos).applyMatrix4(groupRef.current!.matrixWorld);

        const angle = calculateAngleToCamera(worldPos, camera);

        if (angle < minAngle) {
          minAngle = angle;
          closestPOI = poi;
        }
      });

      if (closestPOI !== activePOI) {
        setActivePOI(closestPOI);
        if (onActivePOIChange) {
          onActivePOIChange(closestPOI);
        }
      }
    }
  });

  // Track user interaction status
  useEffect(() => {
    const handlePointerDown = () => setUserInteracting(true);
    const handlePointerUp = () => setUserInteracting(false);

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

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

      <group ref={groupRef} rotation-y={TEXTURE_OFFSET_Y}>
        {modelUrl ? (
          <>
            <Environment preset="city" background={false} environmentIntensity={1.5} />
            <ExternalModel url={modelUrl} />
          </>
        ) : (
          <group>
            <Sphere args={[EARTH_RADIUS, 64, 64]}>
              <primitive object={surfaceMaterial} attach="material" />
            </Sphere>
            <Sphere args={[EARTH_RADIUS + 0.02, 32, 32]}>
              <primitive object={wireframeMaterial} attach="material" />
            </Sphere>
            <Sphere ref={glowRef} args={[EARTH_RADIUS + 0.2, 32, 32]}>
              <primitive object={atmosphereMaterial} attach="material" />
            </Sphere>
          </group>
        )}

        {/* Render POI Markers */}
        {pois.map((poi) => (
          <POIMarker key={poi.id} poi={poi} isActive={activePOI?.id === poi.id} />
        ))}
      </group>
    </>
  );
};

export default HolographicEarth;