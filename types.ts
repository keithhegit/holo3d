import { MutableRefObject } from 'react';

export interface Position {
  x: number;
  y: number;
}

export interface HandStatus {
  isDetected: boolean;
  isPinching: boolean;
  gesture: GestureType;
  cursor: Position; // Normalized 0-1
}

export type GestureType = 'IDLE' | 'PINCH' | 'OPEN' | 'CLOSED';

// Shared state object to communicate between React components without re-renders
export interface SharedState {
  rotation: { x: number; y: number };
  targetRotation: { x: number; y: number };
  scale: number;
  targetScale: number;
  gesture: GestureType;
  isPinching: boolean;
  handPosition: Position;
  lastHandPosition: Position;
}

export type SharedStateRef = MutableRefObject<SharedState>;

// POI (Point of Interest) types
export interface POI {
  id: string;
  label: string;
  lat: number;  // Latitude: -90 to 90
  lon: number;  // Longitude: -180 to 180
  url: string;
  description?: string;
}

// Interaction mode
export type InteractionMode = 'classic' | 'gesture';

// Model selection
export interface ModelData {
  name: string;
  url?: string;
}