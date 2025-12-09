import React, { useState, useEffect, useCallback } from 'react';
import SolarSystem from './components/SolarSystem';
import GestureController from './components/GestureController';
import UIOverlay from './components/UIOverlay';
import PlanetModal from './components/PlanetModal';
import Loader from './components/Loader';
import CreatorInfo from './components/CreatorInfo';
import { PLANETS } from './constants';
import { GestureState, GestureType } from './types';

const App: React.FC = () => {
  const [targetIndex, setTargetIndex] = useState(3); // Start at Earth
  const [zoom, setZoom] = useState(0.5);
  const [showOrbits, setShowOrbits] = useState(true);
  const [sceneRotationY, setSceneRotationY] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanetId, setSelectedPlanetId] = useState<number | null>(null);

  // Loading States
  const [isGestureReady, setIsGestureReady] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  const [currentGesture, setCurrentGesture] = useState<GestureState>({
    type: GestureType.NONE,
    confidence: 0,
    zoomFactor: 0
  });

  // Handle Gesture Inputs
  const handleGesture = useCallback((state: GestureState) => {
    setCurrentGesture(state);

    if (isModalOpen) return; // Disable gestures when modal is open

    if (state.type === GestureType.SWIPE_LEFT) {
      setTargetIndex((prev) => (prev + 1) % PLANETS.length);
    } else if (state.type === GestureType.SWIPE_RIGHT) {
      setTargetIndex((prev) => (prev - 1 + PLANETS.length) % PLANETS.length);
    } else if (state.type === GestureType.PINCH) {
      // Zoom
      const targetZ = Math.min(Math.max((state.zoomFactor - 0.05) * 5, 0), 1);
      setZoom(prev => prev + (targetZ - prev) * 0.1);
    } else if (state.type === GestureType.ROTATE) {
      // Rotate Scene using Twist
      if (state.rotationDelta) {
        setSceneRotationY(prev => prev + state.rotationDelta! * 2);
      }
    } else if (state.type === GestureType.OPEN_PALM) {
      setShowOrbits(prev => !prev);
    }
  }, [isModalOpen]);

  // Keyboard fallback & Rotation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isModalOpen) {
        if (e.key === 'Escape') setIsModalOpen(false);
        return;
      }

      // Navigation
      if (!e.shiftKey) {
        if (e.key === 'ArrowRight') setTargetIndex(p => (p + 1) % PLANETS.length);
        if (e.key === 'ArrowLeft') setTargetIndex(p => (p - 1 + PLANETS.length) % PLANETS.length);
        if (e.key === '+' || e.key === '=') setZoom(z => Math.min(z + 0.1, 1));
        if (e.key === '-' || e.key === '_') setZoom(z => Math.max(z - 0.1, 0));
        if (e.key === 'o' || e.key === 'O') setShowOrbits(prev => !prev);
      }

      // Scene Rotation (Shift + Arrows)
      if (e.shiftKey) {
        const ROT_SPEED = 0.1;
        if (e.key === 'ArrowRight') setSceneRotationY(r => r - ROT_SPEED);
        if (e.key === 'ArrowLeft') setSceneRotationY(r => r + ROT_SPEED);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isModalOpen]);

  const handlePlanetClick = (id: number) => {
    setSelectedPlanetId(id);
    setTargetIndex(id); // Also fly to it
    setIsModalOpen(true);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-black font-sans">

      <Loader
        isGestureReady={isGestureReady}
        onFinished={() => setIsAppReady(true)}
      />

      {/* 3D Layer */}
      <div className="absolute inset-0 z-0">
        <SolarSystem
          targetPlanetIndex={targetIndex}
          zoomLevel={zoom}
          showOrbits={showOrbits}
          sceneRotationY={sceneRotationY}
          onPlanetClick={handlePlanetClick}
        />
      </div>

      {/* Logic Layer */}
      <GestureController
        onGesture={handleGesture}
        onLoaded={() => setIsGestureReady(true)}
      />

      {/* UI Elements - Only show when app is ready for cleaner entrance */}
      <div className={`transition-opacity duration-1000 ${isAppReady ? 'opacity-100' : 'opacity-0'}`}>
        {/* UI Layer */}
        <UIOverlay
          planet={PLANETS[targetIndex]}
          gesture={currentGesture.type}
          confidence={currentGesture.confidence}
          zoom={zoom}
          showOrbits={showOrbits}
        />

        <CreatorInfo />

        {/* Modal Layer */}
        {isModalOpen && selectedPlanetId !== null && (
          <PlanetModal
            planet={PLANETS.find(p => p.id === selectedPlanetId) || PLANETS[0]}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>

    </div>
  );
};

export default App;