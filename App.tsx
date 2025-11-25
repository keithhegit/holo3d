import React, { useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import HandTracker from './components/HandTracker';
import HolographicEarth from './components/HolographicEarth';
import HUD from './components/HUD';
import ModelSelector, { ModelData } from './components/ModelSelector';
import LoadingOverlay from './components/LoadingOverlay';
import { SharedState, HandStatus } from './types';

const App: React.FC = () => {
  // Shared rotation state for high-performance loop
  const sharedState = useRef<SharedState>({
    rotation: { x: 0, y: 0 },
    targetRotation: { x: 0.2, y: 0 },
    scale: 1,
    targetScale: 1,
    gesture: 'IDLE',
    isPinching: false,
    handPosition: { x: 0.5, y: 0.5 },
    lastHandPosition: { x: 0.5, y: 0.5 },
  });

  // UI State
  const [handStatus, setHandStatus] = useState<HandStatus>({
    isDetected: false,
    isPinching: false,
    gesture: 'IDLE',
    cursor: { x: 0.5, y: 0.5 },
  });

  // Model Selection State
  const [selectedModel, setSelectedModel] = useState<ModelData | null>(null);

  const handleModelSelect = (model: ModelData) => {
    setSelectedModel(model);
    // Reset state
    sharedState.current.targetRotation = { x: 0.2, y: 0 };
    sharedState.current.rotation = { x: 0, y: 0 };
    sharedState.current.targetScale = 1;
    sharedState.current.scale = 1;
  };

  const handleReset = () => {
    setSelectedModel(null);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      
      {/* Global Loading Overlay (Monitors all Three.js async loaders) */}
      <LoadingOverlay />

      {/* Layer 1: 3D Scene (Always active, sits in background) */}
      <div className="absolute inset-0 z-0 transition-opacity duration-1000">
        <Canvas 
            camera={{ position: [0, 0, 6], fov: 45 }}
            gl={{ 
                antialias: true, 
                // ACESFilmicToneMapping is best for handling the high contrast of space/holograms
                toneMapping: THREE.ACESFilmicToneMapping, 
                toneMappingExposure: 1.2,
                outputColorSpace: THREE.SRGBColorSpace,
                alpha: true
            }}
        >
          <Suspense fallback={null}>
             {/* If no model selected, we pass undefined to trigger the procedural default sphere */}
             <HolographicEarth 
                sharedState={sharedState} 
                modelUrl={selectedModel?.url} 
             />
             
             {/* 
                HYBRID INTERACTION CONTROLS:
                Disable OrbitControls when user is actively gesturing (Pinch/Zoom)
             */}
             <OrbitControls 
                makeDefault
                enabled={!handStatus.isDetected} 
                autoRotate={!handStatus.isDetected}
                autoRotateSpeed={0.5}
                enableZoom={true}
                enablePan={false}
                minDistance={3}
                maxDistance={10}
                rotateSpeed={0.5}
             />
          </Suspense>
        </Canvas>
      </div>

      {/* Layer 2: Selection Interface (Overlay) */}
      {!selectedModel && (
        <ModelSelector onSelect={handleModelSelect} />
      )}

      {/* Layer 3: HUD Interface (Only when model active) */}
      {selectedModel && (
        <HUD status={handStatus} modelName={selectedModel.name} onBack={handleReset} />
      )}

      {/* Layer 4: Logic Engine (Always running to detect hands ready for interaction) */}
      <HandTracker 
        sharedState={sharedState} 
        onStatusChange={setHandStatus} 
      />
      
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
    </div>
  );
};

export default App;