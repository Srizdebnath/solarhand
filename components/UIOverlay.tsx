import React from 'react';
import { PlanetData, GestureType } from '../types';

interface UIOverlayProps {
  planet: PlanetData;
  gesture: GestureType;
  confidence: number;
  zoom: number;
  showOrbits: boolean;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ planet, gesture, confidence, zoom, showOrbits }) => {
  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-10">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tighter shadow-black drop-shadow-md">
            SOLAR<span className="text-cyan-400">HAND</span>
          </h1>
          <p className="text-gray-400 text-sm">Interactive 3D Visualization</p>
        </div>

        <div className="flex flex-col gap-2 items-end">
          <div className="bg-gray-900/80 p-3 rounded border border-gray-700 text-right backdrop-blur-md w-48">
            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Status</div>
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>Orbits:</span>
              <span className={showOrbits ? "text-green-400" : "text-red-400"}>{showOrbits ? "VISIBLE" : "HIDDEN"}</span>
            </div>
          </div>

          <div className="bg-gray-900/80 p-3 rounded border border-gray-700 text-right backdrop-blur-md w-48">
            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Detected Gesture</div>
            <div className="text-xl text-cyan-400 font-mono font-bold truncate">
              {gesture !== GestureType.NONE ? gesture.replace('_', ' ') : '...'}
            </div>
            <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full transition-all duration-300"
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Instructions / Debug */}
      <div className="flex justify-between items-end">
        <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-700 max-w-md backdrop-blur-md">
          <h2 className="text-3xl font-bold text-white mb-2">{planet.name}</h2>
          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
            <div>
              <span className="text-gray-500 block">Dist. from Sun</span>
              <span className="text-white">{planet.distance === 0 ? '0' : planet.distance} AU</span>
            </div>
            <div>
              <span className="text-gray-500 block">Orbital Speed</span>
              <span className="text-white">{planet.speed} km/s</span>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed text-sm">
            {planet.description}
          </p>
          <div className="mt-4 pt-2 border-t border-gray-700 text-xs text-gray-500">
            <span className="mr-4">Zoom: {(zoom * 100).toFixed(0)}%</span>
            <span>(Click planet or name for more info)</span>
          </div>
        </div>

        <div className="text-right text-gray-500 text-xs mb-44">
          <div className="mb-2 font-bold text-gray-400">CONTROLS</div>
          <div className="flex flex-col gap-1 items-end">
            <span className="bg-gray-800/80 px-2 py-1 rounded border border-gray-700">👋 Swipe L/R : Next/Prev</span>
            <span className="bg-gray-800/80 px-2 py-1 rounded border border-gray-700">👌 Pinch : Zoom</span>
            <span className="bg-gray-800/80 px-2 py-1 rounded border border-gray-700">🤏 Twist : Rotate Scene</span>
            <span className="bg-gray-800/80 px-2 py-1 rounded border border-gray-700">✋ Hold Open Palm : Toggle Orbits</span>
            <span className="bg-gray-800/80 px-2 py-1 rounded border border-gray-700">⌨️ Shift + Arrows : Rotate Scene</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIOverlay;