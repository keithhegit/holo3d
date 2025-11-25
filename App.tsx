import React, { useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import HandTracker from './components/HandTracker';
import HolographicEarth from './components/HolographicEarth';
import HUD from './components/HUD';
import ModelSelector from './components/ModelSelector';
import LoadingOverlay from './components/LoadingOverlay';
import ExploreButton from './components/ExploreButton';
import ModeSwitch from './components/ModeSwitch';
import { SharedState, HandStatus, InteractionMode, POI, ModelData } from './types';
import { POIS } from './data/pois';
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

  // Interaction Mode
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('classic');

  // Active POI tracking
  const [activePOI, setActivePOI] = useState<POI | null>(null);

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

  const handleModeChange = (mode: InteractionMode) => {
    setInteractionMode(mode);
  };

  const handleExplore = () => {
    if (activePOI && activePOI.url) {
      window.location.href = activePOI.url;
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">

      {/* Global Loading Overlay */}
      <LoadingOverlay />

      {/* Layer 1: 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            outputColorSpace: THREE.SRGBColorSpace,
            alpha: true
          }}
        >
          <Suspense fallback={null}>
            <HolographicEarth
              sharedState={sharedState}
              modelUrl={selectedModel?.url}
              pois={POIS}
              onActivePOIChange={setActivePOI}
              interactionMode={interactionMode}
            />

            <OrbitControls
              makeDefault
              enabled={interactionMode === 'classic' && !handStatus.isDetected}
              enableDamping={true}
              dampingFactor={0.05}
              autoRotate={false} // We'll handle rotation manually
              enableZoom={false}
              enablePan={false}
              minDistance={3}
              maxDistance={10}
              rotateSpeed={0.5}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Layer 2: Model Selection Interface */}
      {!selectedModel && (
        <ModelSelector onSelect={handleModelSelect} />
      )}

      {/* Layer 3: HUD Interface */}
      {selectedModel && (
        <HUD status={handStatus} modelName={selectedModel.name} onBack={handleReset} />
      )}

      {/* Layer 4: Mode Switch */}
      <ModeSwitch mode={interactionMode} onModeChange={handleModeChange} />

      {/* Layer 5: Explore Button */}
      <ExploreButton
        onExplore={handleExplore}
        activePOILabel={activePOI?.label}
        disabled={!activePOI}
      />

      {/* Layer 6: Hand Tracker (only in gesture mode) */}
      {interactionMode === 'gesture' && (
        <HandTracker
          sharedState={sharedState}
          onStatusChange={setHandStatus}
        />
      )}

      {/* Background Grid Overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
    </div>
  );
};

export default App;