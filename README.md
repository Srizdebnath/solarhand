# SolarHand 3D

An interactive 3D solar system visualization controlled by hand gestures via webcam.

## Prerequisites

- Node.js 16+
- Python 3.10+
- A webcam

## Quick Start

### 1. Frontend (React/Next.js structure)

The code provided is structured for a standard React app (Vite recommended) or Next.js.
If using Vite:

```bash
npm install react react-dom three @types/three @react-three/fiber @react-three/drei
npm run dev
```

(Ensure `index.html` is served).

### 2. Backend (Python FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Adding Textures (Crucial for visuals)

The app is configured to look for textures in the `public/textures` folder. To see the planets with realistic surfaces:

1.  Create a folder: `public/textures/`
2.  Download standard solar system textures (freely available from sites like [Solar System Scope](https://www.solarsystemscope.com/textures/)).
3.  Rename them to match the code:
    *   `sun.jpg`
    *   `mercury.jpg`
    *   `venus.jpg`
    *   `earth.jpg`
    *   `mars.jpg`
    *   `jupiter.jpg`
    *   `saturn.jpg`
    *   `uranus.jpg`
    *   `neptune.jpg`
4.  Place these 9 files into your `public/textures/` folder.
    *   *Note: If you don't add textures, the app will show wireframe spheres as placeholders.*

## How It Works

### Gesture Mapping

We use **MediaPipe Hands** running entirely on the client (browser) for low latency.

1.  **Swipe Navigation**:
    *   We track the x-coordinate of the `WRIST` (landmark 0).
    *   We compare `currentX` vs `previousX`.
    *   If velocity > threshold, we trigger a "Swipe Left" or "Swipe Right" event.
    *   This cycles the `targetIndex` in the planet array.

2.  **Pinch Zoom**:
    *   We calculate Euclidean distance between `THUMB_TIP` (4) and `INDEX_FINGER_TIP` (8).
    *   This distance is normalized (approx 0.05 to 0.3 in screen space).
    *   This value is smoothed (lerped) into a `zoom` state (0.0 to 1.0).
    *   In the 3D scene, `zoom` determines the offset distance of the camera relative to the target planet.

### 3D Camera Logic

We do not use standard `OrbitControls`. Instead, we use a custom `CameraController` component inside the Canvas.
*   Every frame (`useFrame`), we calculate the target planet's world position.
*   We `lerp` (linear interpolate) the camera's current position to a computed offset position near the planet.
*   This creates a "flight" effect when switching planets.

## Privacy

All video processing happens locally in your browser using MediaPipe's client-side solution. No video frames are sent to the backend. The backend is only used for serving planet data.