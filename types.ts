export interface PlanetData {
  id: number;
  name: string;
  color: string;
  size: number; // Relative radius
  distance: number; // Distance from Sun
  speed: number; // Orbit speed
  description: string;
  textureUrl: string; // Path to texture image
}

export enum GestureType {
  NONE = 'NONE',
  SWIPE_LEFT = 'SWIPE_LEFT',
  SWIPE_RIGHT = 'SWIPE_RIGHT',
  PINCH = 'PINCH',
  OPEN_PALM = 'OPEN_PALM',
  ROTATE = 'ROTATE', // Two-finger twist
  IDLE = 'IDLE'
}

export interface GestureState {
  type: GestureType;
  confidence: number;
  zoomFactor: number; // 0.0 to 1.0
  rotationDelta?: number; // Radians for rotation
}