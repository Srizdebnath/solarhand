import React from 'react';
import { PlanetData } from '../types';

interface PlanetModalProps {
  planet: PlanetData;
  onClose: () => void;
}

const PlanetModal: React.FC<PlanetModalProps> = ({ planet, onClose }) => {
  const styles = `
    @keyframes modalIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .modal-animate-in {
      animation: modalIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
  `;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <style>{styles}</style>
      <div
        className="bg-gray-900 border border-gray-600 rounded-xl p-8 max-w-2xl w-full shadow-2xl relative modal-animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-48 h-48 rounded-full shadow-inner bg-black flex-shrink-0 border-4 border-gray-800 overflow-hidden relative">
            {/* Simple visual representation for modal */}
            <div
              className="w-full h-full rounded-full"
              style={{
                backgroundColor: planet.color,
                background: `radial-gradient(circle at 30% 30%, ${planet.color}, #000)`,
                boxShadow: `0 0 30px ${planet.color}40`
              }}
            />
          </div>

          <div className="flex-1">
            <h2 className="text-5xl font-bold text-white mb-2">{planet.name}</h2>
            <div className="flex gap-4 mb-6 text-sm text-cyan-400 font-mono">
              <span>ID: {planet.id}</span>
              <span>TYPE: {planet.distance === 0 ? 'STAR' : 'PLANET'}</span>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              {planet.description}
            </p>

            <div className="grid grid-cols-2 gap-4 bg-gray-800/50 p-4 rounded-lg">
              <div>
                <span className="block text-xs text-gray-500 uppercase">Distance</span>
                <span className="text-white font-mono">{planet.distance} AU</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 uppercase">Size (Rel)</span>
                <span className="text-white font-mono">{planet.size}x</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 uppercase">Orbital Speed</span>
                <span className="text-white font-mono">{planet.speed}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 uppercase">Rotation</span>
                <span className="text-white font-mono">Variable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanetModal;