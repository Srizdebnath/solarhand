import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

interface LoaderProps {
    isGestureReady: boolean;
    onFinished: () => void;
}

const Loader: React.FC<LoaderProps> = ({ isGestureReady, onFinished }) => {
    const { progress } = useProgress();
    const [shouldRender, setShouldRender] = useState(true);
    const [opacity, setOpacity] = useState(1);

    const isAssetsLoaded = progress === 100;
    const isReady = isAssetsLoaded && isGestureReady;

    useEffect(() => {
        if (isReady) {
            // Small delay to ensure smooth transition
            const timer = setTimeout(() => {
                setOpacity(0);
                setTimeout(() => {
                    setShouldRender(false);
                    onFinished();
                }, 1000); // Wait for fade out
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isReady, onFinished]);

    if (!shouldRender) return null;

    return (
        <div
            className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center transition-opacity duration-1000"
            style={{ opacity }}
        >
            <div className="relative mb-8">
                <div className="w-24 h-24 border-4 border-gray-800 rounded-full animate-spin border-t-cyan-500"></div>
                <div className="absolute inset-0 flex items-center justify-center font-mono text-cyan-500 font-bold">
                    {((progress + (isGestureReady ? 100 : 0)) / 2).toFixed(0)}%
                </div>
            </div>

            <h1 className="text-4xl font-bold text-white tracking-[0.2em] mb-4">
                SOLAR<span className="text-cyan-400">HAND</span>
            </h1>

            <div className="flex flex-col items-center gap-2 text-sm text-gray-400 font-mono">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isAssetsLoaded ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                    <span>Loading Assets... {progress.toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isGestureReady ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                    <span>Initializing Vision Model...</span>
                </div>
            </div>
        </div>
    );
};

export default Loader;
