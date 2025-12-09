import React, { useRef, useMemo, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Line, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { PLANETS } from '../constants';
import { PlanetData } from '../types';

const TwinklingStars = () => {
  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    if (ref.current && ref.current.material instanceof THREE.ShaderMaterial) {
      ref.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const [positions, sizes] = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 800;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 800;
      sizes[i] = Math.random();
    }
    return [positions, sizes];
  }, []);

  const shader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#ffffff') }
    },
    vertexShader: `
      uniform float uTime;
      attribute float aSize;
      varying float vOpacity;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        float size = aSize * (1.0 + 0.5 * sin(uTime * 2.0 + position.x * 0.1));
        gl_PointSize = size * (400.0 / -mvPosition.z);
        vOpacity = 0.5 + 0.5 * sin(uTime * 3.0 + position.y * 0.5);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vOpacity;
      void main() {
        if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.5) discard;
        gl_FragColor = vec4(uColor, vOpacity);
      }
    `
  }), []);

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={sizes.length} array={sizes} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial attach="material" args={[shader]} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
};

const SaturnRings = ({ radius }: { radius: number }) => (
  <group rotation={[Math.PI / 2.5, 0, 0]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius * 1.4, radius * 2.2, 64]} />
      <meshStandardMaterial
        color="#A49B72"
        side={THREE.DoubleSide}
        transparent
        opacity={0.8}
        emissive="#A49B72"
        emissiveIntensity={0.2}
      />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius * 1.1, radius * 1.3, 64]} />
      <meshStandardMaterial
        color="#C5BC98"
        side={THREE.DoubleSide}
        transparent
        opacity={0.6}
      />
    </mesh>
  </group>
);

// Declare intrinsic elements to satisfy TS if @react-three/fiber types miss them or for custom usage
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      color: any;
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      shaderMaterial: any;
      ringGeometry: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      color: any;
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      shaderMaterial: any;
      ringGeometry: any;
    }
  }
}

interface SceneProps {
  targetPlanetIndex: number;
  zoomLevel: number;
  showOrbits: boolean;
  sceneRotationY: number;
  onPlanetClick: (planetId: number) => void;
}

const PlanetMesh: React.FC<{ data: PlanetData }> = ({ data }) => {
  const texture = useTexture(data.textureUrl);

  return (
    <mesh>
      <sphereGeometry args={[data.size, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        color={data.id === 0 ? undefined : '#ffffff'}
        emissive={data.id === 0 ? data.color : '#000000'}
        emissiveMap={data.id === 0 ? texture : undefined}
        emissiveIntensity={data.id === 0 ? 2 : 0}
        roughness={data.id === 0 ? 0 : 0.7}
        metalness={0.2}
      />
    </mesh>
  );
}

const PlanetFallback: React.FC<{ data: PlanetData }> = ({ data }) => (
  <mesh>
    <sphereGeometry args={[data.size, 32, 32]} />
    <meshStandardMaterial color={data.color} wireframe />
  </mesh>
);

const Planet: React.FC<{
  data: PlanetData;
  isSelected: boolean;
  showOrbit: boolean;
  zoomLevel: number;
  onClick: () => void;
}> = ({ data, isSelected, showOrbit, zoomLevel, onClick }) => {
  const orbitRef = useRef<THREE.Group>(null);
  const meshGroupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const orbitOpacity = 0.1 + (zoomLevel * 0.3); // Dynamic opacity based on zoom

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (orbitRef.current) {
      orbitRef.current.rotation.y = t * data.speed * 0.1;
    }
    if (meshGroupRef.current) {
      // Self rotation
      meshGroupRef.current.rotation.y += 0.01 / (data.size + 0.1);
      // Subtle wobble
      meshGroupRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
      meshGroupRef.current.rotation.x = Math.cos(t * 0.3) * 0.05;
    }
  });

  const orbitPoints = useMemo(() => {
    if (data.distance === 0) return null;
    const points = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * data.distance, 0, Math.sin(angle) * data.distance));
    }
    return points;
  }, [data.distance]);

  return (
    <group>
      {showOrbit && orbitPoints && (
        <Line
          points={orbitPoints}
          color="#ffffff"
          opacity={orbitOpacity}
          transparent
          lineWidth={1}
        />
      )}

      <group ref={orbitRef}>
        <group position={[data.distance, 0, 0]}>
          <group
            ref={meshGroupRef}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            scale={hovered ? 1.1 : 1}
          >
            <Suspense fallback={<PlanetFallback data={data} />}>
              <PlanetMesh data={data} />
              {data.name === 'Saturn' && <SaturnRings radius={data.size} />}
            </Suspense>
          </group>

          <Text
            position={[0, data.size + 1.2, 0]}
            fontSize={hovered || isSelected ? 0.8 : 0.5}
            color={isSelected || hovered ? "white" : "gray"}
            anchorX="center"
            anchorY="middle"
            billboard
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
          >
            {data.name}
          </Text>
        </group>
      </group>
    </group>
  );
};

const CameraController: React.FC<{ targetIndex: number; zoom: number; rotationOffset: number }> = ({ targetIndex, zoom, rotationOffset }) => {
  const { camera } = useThree();
  const vec = new THREE.Vector3();
  const targetPos = new THREE.Vector3();

  useFrame(({ clock }) => {
    const planetData = PLANETS[targetIndex];
    const t = clock.getElapsedTime();
    const angle = t * planetData.speed * 0.1;

    // Calculate the target planet's position within the rotating group
    // Note: The planets are in a group that rotates by sceneRotationY (see SolarSystem component).
    // The camera needs to track the world position.

    // Planet local pos in system
    const px = Math.cos(angle) * planetData.distance;
    const pz = -Math.sin(angle) * planetData.distance;

    // Apply scene rotation offset to position to get World coordinate
    const cosR = Math.cos(rotationOffset);
    const sinR = Math.sin(rotationOffset);
    const worldX = px * cosR - pz * sinR;
    const worldZ = px * sinR + pz * cosR;

    targetPos.set(worldX, 0, worldZ);

    const baseDistance = planetData.size * 3 + 2;
    const zoomOffset = baseDistance + (10 * Math.pow(1 - zoom, 2));

    // Camera offset from target
    // We maintain a relative angle to the target, but also rotate with the scene so we don't just stare at one side
    const camAngle = rotationOffset + Math.PI / 4;
    const camX = worldX + zoomOffset * Math.cos(camAngle);
    const camY = zoomOffset * 0.5 + 5 * (1 - zoom);
    const camZ = worldZ + zoomOffset * Math.sin(camAngle);

    vec.set(camX, camY, camZ);
    camera.position.lerp(vec, 0.05);
    camera.lookAt(targetPos);
  });

  return null;
};

const SolarSystem: React.FC<SceneProps> = ({ targetPlanetIndex, zoomLevel, showOrbits, sceneRotationY, onPlanetClick }) => {
  return (
    <div className="w-full h-full bg-black">
      <Canvas shadows camera={{ position: [0, 20, 20], fov: 45 }}>
        <color attach="background" args={['#020205']} />

        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} intensity={2} decay={0} distance={1000} color="#ffaa55" />

        <TwinklingStars />

        {/* Global Scene Rotation Group */}
        <group rotation={[0, sceneRotationY, 0]}>
          {PLANETS.map((planet, idx) => (
            <Planet
              key={planet.id}
              data={planet}
              isSelected={idx === targetPlanetIndex}
              showOrbit={showOrbits}
              zoomLevel={zoomLevel}
              onClick={() => onPlanetClick(planet.id)}
            />
          ))}
        </group>

        <CameraController targetIndex={targetPlanetIndex} zoom={zoomLevel} rotationOffset={sceneRotationY} />

        <EffectComposer enableNormalPass>
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.4} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default SolarSystem;