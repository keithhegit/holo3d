import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as mpHands from '@mediapipe/hands';
import * as mpDrawing from '@mediapipe/drawing_utils';
import { SharedStateRef, HandStatus, GestureType } from '../types';

// Fix for CDN import issues: Extract classes/functions from default export if named exports are missing
const Hands = (mpHands as any).Hands || (mpHands as any).default?.Hands;
const drawConnectors = (mpDrawing as any).drawConnectors || (mpDrawing as any).default?.drawConnectors;
const drawLandmarks = (mpDrawing as any).drawLandmarks || (mpDrawing as any).default?.drawLandmarks;

interface HandTrackerProps {
  sharedState: SharedStateRef;
  onStatusChange: (status: HandStatus) => void;
}

// Manually define HAND_CONNECTIONS to avoid import errors from CDN bundles
const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]
];

// Define minimal interface for Results to avoid runtime import issues
interface Results {
    multiHandLandmarks: Array<Array<{x: number, y: number, z: number}>>;
    image: any;
}

const HandTracker: React.FC<HandTrackerProps> = ({ sharedState, onStatusChange }) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const handsRef = useRef<any>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Helper to calculate distance between two landmarks
  const getDistance = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  const onResults = (results: Results) => {
    // 1. Draw landmarks on debug canvas
    const canvasCtx = canvasRef.current?.getContext('2d');
    if (canvasCtx && canvasRef.current) {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Mirror the debug view to match user movement naturalness
      canvasCtx.scale(-1, 1);
      canvasCtx.translate(-canvasRef.current.width, 0);

      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          if (drawConnectors && HAND_CONNECTIONS) {
              drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 1 });
          }
          if (drawLandmarks) {
              drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 1, radius: 2 });
          }
        }
      }
      canvasCtx.restore();
    }

    // 2. Logic Processing
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      
      // Key Landmarks
      const wrist = landmarks[0];
      const thumbTip = landmarks[4];
      const indexTip = landmarks[8];
      
      // Screen coordinates (flipped X for mirror effect)
      const cursorX = 1 - indexTip.x;
      const cursorY = indexTip.y;

      // --- PINCH DETECTION ---
      const pinchDistance = getDistance(indexTip, thumbTip);
      // Threshold for pinch (grab)
      const isPinching = pinchDistance < 0.05; 

      // --- GESTURE CLASSIFICATION (OPEN vs CLOSED) ---
      // We determine if fingers are extended by comparing Tip-to-Wrist vs PIP-to-Wrist distance
      // Finger Tips: 8, 12, 16, 20
      // Finger PIPs: 6, 10, 14, 18
      let extendedFingers = 0;
      
      const fingerIndices = [8, 12, 16, 20];
      const pipIndices = [6, 10, 14, 18];
      
      for (let i = 0; i < fingerIndices.length; i++) {
        const tipDist = getDistance(landmarks[fingerIndices[i]], wrist);
        const pipDist = getDistance(landmarks[pipIndices[i]], wrist);
        // If tip is significantly further from wrist than PIP joint, it's extended
        if (tipDist > pipDist * 1.1) {
            extendedFingers++;
        }
      }
      
      // Thumb check: Tip(4) vs IP(3) or MCP(2) is tricky. 
      // Simple heuristic: distance from Pinky MCP(17)
      const thumbDist = getDistance(thumbTip, landmarks[17]);
      const isThumbExtended = thumbDist > 0.2; // Rough threshold
      if (isThumbExtended) extendedFingers++;

      let currentGesture: GestureType = 'IDLE';

      if (isPinching) {
        currentGesture = 'PINCH';
      } else if (extendedFingers >= 4) {
        currentGesture = 'OPEN'; // Zoom In
      } else if (extendedFingers <= 1) {
        currentGesture = 'CLOSED'; // Zoom Out
      }

      // Update Shared State (Physics/Logic)
      const state = sharedState.current;
      
      // Rotation Logic (Only when Pinching)
      if (currentGesture === 'PINCH') {
        if (!state.isPinching) {
            // Just started pinching, sync last position
            state.lastHandPosition = { x: cursorX, y: cursorY };
        }

        const deltaX = cursorX - state.lastHandPosition.x;
        const deltaY = cursorY - state.lastHandPosition.y;

        // Apply rotation (Sensitivity factor 5.0)
        state.targetRotation.y += deltaX * 5.0; 
        state.targetRotation.x += deltaY * 5.0;

        state.lastHandPosition = { x: cursorX, y: cursorY };
      }

      state.isPinching = (currentGesture === 'PINCH');
      state.gesture = currentGesture;
      state.handPosition = { x: cursorX, y: cursorY };

      // Update UI Status
      onStatusChange({
        isDetected: true,
        isPinching: state.isPinching,
        gesture: currentGesture,
        cursor: { x: cursorX, y: cursorY }
      });

    } else {
      // No hands detected
      sharedState.current.isPinching = false;
      sharedState.current.gesture = 'IDLE';
      onStatusChange({
        isDetected: false,
        isPinching: false,
        gesture: 'IDLE',
        cursor: { x: 0.5, y: 0.5 }
      });
    }
  };

  useEffect(() => {
    const initHands = async () => {
      const hands = new Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1, // Focus on single hand interaction
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults(onResults);
      handsRef.current = hands;
    };

    initHands();
    
    // Start Loop
    const loop = async () => {
      if (
          handsRef.current &&
          webcamRef.current &&
          webcamRef.current.video &&
          webcamRef.current.video.readyState === 4
      ) {
            await handsRef.current.send({ image: webcamRef.current.video });
      }
      requestRef.current = requestAnimationFrame(loop);
    };
    loop();
    
    return () => {
      cancelAnimationFrame(requestRef.current);
      if (handsRef.current) handsRef.current.close();
    };
  }, []);

  return (
    <div className="absolute bottom-5 right-5 w-48 h-36 border border-cyan-800 bg-black/80 rounded-lg overflow-hidden z-20 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
      {/* Hidden Webcam Input */}
      <Webcam
        ref={webcamRef}
        audio={false}
        mirrored={false} 
        screenshotFormat="image/jpeg"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
        onUserMedia={() => setIsCameraReady(true)}
      />

      {/* Debug Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-10"
      />
      
      {!isCameraReady && (
        <div className="absolute inset-0 flex items-center justify-center text-cyan-500 text-xs animate-pulse">
            INITIALIZING CAM...
        </div>
      )}
    </div>
  );
};

export default HandTracker;