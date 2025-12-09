import React, { useEffect, useRef, useState } from 'react';
import { GestureType, GestureState } from '../types';

declare global {
  interface Window {
    Hands: any;
    Camera: any;
    drawConnectors: any;
    drawLandmarks: any;
    HAND_CONNECTIONS: any;
  }
}

interface GestureControllerProps {
  onGesture: (gesture: GestureState) => void;
  onLoaded?: () => void;
}

const GestureController: React.FC<GestureControllerProps> = ({ onGesture, onLoaded }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastGestureTime = useRef<number>(0);
  const lastPalmX = useRef<number>(0.5);
  const lastAngle = useRef<number | null>(null);

  // Throttle state for Open Palm to avoid flickering toggles
  const openPalmFrameCount = useRef<number>(0);

  useEffect(() => {
    if (!videoRef.current || !window.Hands) return;

    const hands = new window.Hands({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });

    hands.onResults((results: any) => {
      drawResults(results);
      processResults(results);
    });

    const camera = new window.Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await hands.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480
    });

    camera.start()
      .then(() => {
        setIsLoaded(true);
        if (onLoaded) onLoaded();
      })
      .catch((err: any) => console.error("Camera error:", err));

    return () => {
      // Cleanup
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawResults = (results: any) => {
    if (!canvasRef.current || !videoRef.current) return;
    const canvasCtx = canvasRef.current.getContext('2d');
    if (!canvasCtx) return;

    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, width, height);

    // Draw landmarks
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        if (window.drawConnectors) {
          window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, {
            color: '#00FFFF',
            lineWidth: 2
          });
        }
        if (window.drawLandmarks) {
          window.drawLandmarks(canvasCtx, landmarks, {
            color: '#FF0000',
            lineWidth: 1,
            radius: 3
          });
        }

        // Draw bounding box for visual feedback
        const xValues = landmarks.map((l: any) => l.x);
        const yValues = landmarks.map((l: any) => l.y);
        const minX = Math.min(...xValues) * width;
        const maxX = Math.max(...xValues) * width;
        const minY = Math.min(...yValues) * height;
        const maxY = Math.max(...yValues) * height;

        canvasCtx.strokeStyle = '#00FF00';
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeRect(minX, minY, maxX - minX, maxY - minY);
      }
    }
    canvasCtx.restore();
  };

  const processResults = (results: any) => {
    const now = Date.now();
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      openPalmFrameCount.current = 0;
      lastAngle.current = null;
      onGesture({ type: GestureType.NONE, confidence: 0, zoomFactor: 0 });
      return;
    }

    const landmarks = results.multiHandLandmarks[0];

    // Landmark Indices:
    // 0: Wrist
    // 4: Thumb Tip
    // 8: Index Tip
    // 20: Pinky Tip

    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const pinkyTip = landmarks[20];

    // Distance calculations
    const pinchDistance = Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) +
      Math.pow(thumbTip.y - indexTip.y, 2)
    );

    const palmSpread = Math.sqrt(
      Math.pow(indexTip.x - pinkyTip.x, 2) +
      Math.pow(indexTip.y - pinkyTip.y, 2)
    );

    // --- 1. OPEN PALM DETECTION (Toggle Orbits) ---
    // If pinch distance is large (fingers apart) AND palm spread is large
    if (pinchDistance > 0.3 && palmSpread > 0.3) {
      openPalmFrameCount.current += 1;
      if (openPalmFrameCount.current > 15) { // ~0.5s hold
        if (now - lastGestureTime.current > 1500) {
          onGesture({ type: GestureType.OPEN_PALM, confidence: 0.9, zoomFactor: 0 });
          lastGestureTime.current = now;
          openPalmFrameCount.current = 0;
          return;
        }
      }
    } else {
      openPalmFrameCount.current = 0;
    }

    // --- 2. PINCH & TWIST DETECTION (Zoom & Rotate) ---
    if (pinchDistance < 0.2) { // Fingers close enough to be interacting

      // Calculate Angle for Twist (Rotation)
      // Angle in radians between the thumb and index finger vector
      const dy = indexTip.y - thumbTip.y;
      const dx = indexTip.x - thumbTip.x;
      const currentAngle = Math.atan2(dy, dx);

      let rotationDelta = 0;
      if (lastAngle.current !== null) {
        let diff = currentAngle - lastAngle.current;
        // Normalize -PI to PI
        if (diff > Math.PI) diff -= 2 * Math.PI;
        if (diff < -Math.PI) diff += 2 * Math.PI;

        // Threshold to ignore jitter
        if (Math.abs(diff) > 0.02) {
          rotationDelta = diff;
        }
      }
      lastAngle.current = currentAngle;

      // If rotating significantly, prefer rotation over zoom
      if (Math.abs(rotationDelta) > 0.05) {
        onGesture({
          type: GestureType.ROTATE,
          confidence: 0.8,
          zoomFactor: pinchDistance,
          rotationDelta: rotationDelta
        });
        return;
      }

      // Otherwise treat as Zoom (Pinch)
      onGesture({
        type: GestureType.PINCH,
        confidence: 0.9,
        zoomFactor: pinchDistance, // Pass raw distance, UI maps it
        rotationDelta: 0
      });
      return;
    } else {
      lastAngle.current = null;
    }

    // --- 3. SWIPE DETECTION ---
    const palmX = landmarks[0].x;
    const deltaX = palmX - lastPalmX.current;
    lastPalmX.current = palmX;

    if (now - lastGestureTime.current > 500) {
      const swipeThreshold = 0.05;

      if (deltaX > swipeThreshold) {
        onGesture({ type: GestureType.SWIPE_LEFT, confidence: 0.8, zoomFactor: 0 });
        lastGestureTime.current = now;
      } else if (deltaX < -swipeThreshold) {
        onGesture({ type: GestureType.SWIPE_RIGHT, confidence: 0.8, zoomFactor: 0 });
        lastGestureTime.current = now;
      } else {
        // Idle
        onGesture({ type: GestureType.IDLE, confidence: 0.5, zoomFactor: 0 });
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-48 h-36 rounded-lg overflow-hidden border-2 border-cyan-500 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full h-full transform -scale-x-100">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          width={640}
          height={480}
        />
      </div>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-xs text-center p-1 bg-black/80">
          Loading Vision Model...
        </div>
      )}
      <div className="absolute bottom-0 right-0 left-0 bg-black/60 text-white text-[10px] p-1 text-center transform pointer-events-none">
        Debug View (Mirrored)
      </div>
    </div>
  );
};

export default GestureController;