import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ZoomIn, ZoomOut, RotateCcw, Compass, Footprints, Eye, Move, Maximize2, Minimize2 } from 'lucide-react';
import { OfficeEmployeeData, SpeechBubbleItem, CameraPreset } from '../../types/office';
import { OfficeEnvironment } from './OfficeEnvironment';
import { HumanoidCharacter } from './HumanoidCharacter';
import { ReportingSplines } from './ReportingSplines';
import { PlayerAvatar } from './PlayerAvatar';

// Photorealistic Image-Based Studio Lighting (IBL) & Environment Reflections
const RealisticStudioLighting: React.FC = () => {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTexture;

    return () => {
      pmremGenerator.dispose();
      roomEnv.dispose();
      envTexture.dispose();
    };
  }, [gl, scene]);

  return null;
};

// Modern High-Rise City Skyline Panorama outside West curtain wall
const SkyscraperCityPanorama: React.FC = () => {
  const buildings = [
    { x: -24, z: -14, w: 5, h: 22, d: 6, color: '#090d16', lightColor: '#38bdf8' },
    { x: -25, z: -6, w: 6, h: 28, d: 7, color: '#0b111e', lightColor: '#fbbf24' },
    { x: -24, z: 2, w: 5, h: 18, d: 5, color: '#0c1322', lightColor: '#38bdf8' },
    { x: -26, z: 9, w: 7, h: 25, d: 6, color: '#080d18', lightColor: '#a78bfa' },
    { x: -24, z: 16, w: 5, h: 16, d: 5, color: '#0a101c', lightColor: '#34d399' },
  ];

  return (
    <group position={[0, 0, 0]}>
      {buildings.map((b, i) => (
        <group key={`bldg-${i}`} position={[b.x, b.h / 2 - 2, b.z]}>
          {/* Main Tower Mass */}
          <mesh>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={b.color} roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Glowing Window Strips */}
          {[-4, -1, 2, 5, 8].map((wy, widx) => (
            <mesh key={`win-${widx}`} position={[b.w / 2 + 0.05, wy, 0]}>
              <planeGeometry args={[0.05, 0.6]} />
              <meshStandardMaterial color={b.lightColor} emissive={b.lightColor} emissiveIntensity={0.8} />
            </mesh>
          ))}
          {/* Rooftop Obstruction Beacon Light */}
          <mesh position={[0, b.h / 2 + 0.2, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.0} />
          </mesh>
        </group>
      ))}
      {/* Distant Atmospheric Twilight Glow */}
      <mesh position={[-28, 6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[48, 24]} />
        <meshBasicMaterial color="#0b172a" transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

// Modern Suspended Office Acoustic Ceiling with Recessed LED Troffers
const OfficeCeiling: React.FC = () => (
  <group position={[0, 4.02, 0]}>
    {/* Acoustic Ceiling Grid Plane (BackSide visible from inside) */}
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[40, 32]} />
      <meshStandardMaterial color="#0b0f19" roughness={0.9} side={THREE.DoubleSide} />
    </mesh>
    {/* Grid of Recessed 2x2 LED Troffers */}
    {[-14, -7, 0, 7, 14].map((x) =>
      [-10, -4, 2, 8, 14].map((z) => (
        <group key={`troffer-${x}-${z}`} position={[x, -0.02, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.6, 1.6]} />
            <meshStandardMaterial color="#ffffff" emissive="#f8fafc" emissiveIntensity={0.85} side={THREE.DoubleSide} />
          </mesh>
          {/* Troffer Aluminum Bezel */}
          <mesh position={[0, -0.01, 0]}>
            <boxGeometry args={[1.7, 0.03, 1.7]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))
    )}
  </group>
);

const PRESET_CONFIGS: Record<CameraPreset, { pos: [number, number, number]; lookAt: [number, number, number] }> = {
  overview: { pos: [0, 2.4, 18.6], lookAt: [0, 1.4, 4.0] }, // Eye-level Entrance View by default!
  top_down: { pos: [0, 36, 0.05], lookAt: [0, 0, 0] },
  aditya_cabin: { pos: [-14, 2.2, -7.2], lookAt: [-14, 1.2, -10] },
  giriraj_cabin: { pos: [13, 2.2, -7.2], lookAt: [13, 1.2, -10] },
  dev_pod: { pos: [0, 2.2, 8.5], lookAt: [0, 1.0, 2.0] },
  qa_lab: { pos: [13, 2.2, 3.5], lookAt: [13, 1.2, 0.5] },
  devops: { pos: [13, 2.2, 13.5], lookAt: [13, 1.5, 10.5] },
  ba_lounge: { pos: [-14, 2.2, 3.2], lookAt: [-14, 1.0, 0] },
  follow: { pos: [0, 2.8, 5.0], lookAt: [0, 1.2, 0] },
};

interface CameraControllerProps {
  preset: CameraPreset;
  followedEmployee: OfficeEmployeeData | null;
  controlsRef: React.MutableRefObject<any>;
  isWalkMode?: boolean;
}

const CameraController: React.FC<CameraControllerProps> = ({
  preset,
  followedEmployee,
  controlsRef,
  isWalkMode
}) => {
  const { camera } = useThree();
  const isTransitioning = useRef<boolean>(true);
  const targetPos = useRef(new THREE.Vector3(0, 22, 26));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const prevFollowCoords = useRef<[number, number, number] | null>(null);

  // Trigger smooth transition whenever preset changes or a new employee is followed
  useEffect(() => {
    if (isWalkMode) return;

    if (preset === 'follow' && followedEmployee) {
      const [x, y, z] = followedEmployee.current_coords;
      targetLook.current.set(x, y + 1.1, z);
      targetPos.current.set(x, y + 1.8, z + 3.2);
      prevFollowCoords.current = [x, y, z];
      isTransitioning.current = true;
      return;
    }

    prevFollowCoords.current = null;
    const config = PRESET_CONFIGS[preset] || PRESET_CONFIGS.overview;
    targetPos.current.set(...config.pos);
    targetLook.current.set(...config.lookAt);
    isTransitioning.current = true;
  }, [preset, followedEmployee?.id, isWalkMode]);

  // Cancel programmatic camera transition immediately when user begins any interaction
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const onStart = () => {
      isTransitioning.current = false;
    };

    controls.addEventListener('start', onStart);
    return () => {
      controls.removeEventListener('start', onStart);
    };
  }, [controlsRef.current]);

  useFrame((_, delta) => {
    if (isWalkMode) return; // PlayerAvatar handles camera in walk mode
    const controls = controlsRef.current;
    if (!controls) return;

    // Follow mode dynamic tracking without hijacking user zoom or orbit angle
    if (preset === 'follow' && followedEmployee) {
      const [fx, fy, fz] = followedEmployee.current_coords;

      if (isTransitioning.current) {
        const lerpFactor = Math.min(delta * 4.5, 0.25);
        camera.position.lerp(targetPos.current, lerpFactor);
        controls.target.lerp(targetLook.current, lerpFactor);
        controls.update();

        if (
          camera.position.distanceTo(targetPos.current) < 0.1 &&
          controls.target.distanceTo(targetLook.current) < 0.1
        ) {
          isTransitioning.current = false;
        }
      } else {
        // Free-orbit and free-zoom follow mode:
        // Translate both camera & target equally as employee moves
        if (prevFollowCoords.current) {
          const [px, py, pz] = prevFollowCoords.current;
          const dx = fx - px;
          const dy = fy - py;
          const dz = fz - pz;
          if (Math.abs(dx) > 0.0001 || Math.abs(dy) > 0.0001 || Math.abs(dz) > 0.0001) {
            controls.target.add(new THREE.Vector3(dx, dy, dz));
            camera.position.add(new THREE.Vector3(dx, dy, dz));
            controls.update();
          }
        }
      }

      prevFollowCoords.current = [fx, fy, fz];
      return;
    }

    // Standard preset transition
    if (isTransitioning.current) {
      const lerpFactor = Math.min(delta * 4.5, 0.25);
      camera.position.lerp(targetPos.current, lerpFactor);
      controls.target.lerp(targetLook.current, lerpFactor);
      controls.update();

      if (
        camera.position.distanceTo(targetPos.current) < 0.12 &&
        controls.target.distanceTo(targetLook.current) < 0.12
      ) {
        isTransitioning.current = false;
      }
    }
  });

  return null;
};

interface OfficeSceneProps {
  employees: OfficeEmployeeData[];
  speechMap: Record<string, SpeechBubbleItem>;
  selectedEmployeeId: string | null;
  onSelectEmployee: (emp: OfficeEmployeeData) => void;
  onSelectZone: (zone: string) => void;
  cameraPreset: CameraPreset;
  speedMultiplier: number;
  performanceMode: boolean;
  followedEmployee: OfficeEmployeeData | null;
  activeRoutePoints: [number, number, number][];
  isWalkMode?: boolean;
  onToggleWalkMode?: () => void;
  isGateOpen?: boolean;
  onToggleGate?: () => void;
  onTalkToEmployee?: (emp: OfficeEmployeeData) => void;
  activeDialogueEmployeeId?: string | null;
  nearestEmployeeId?: string | null;
  onLeaveEmployeeZone?: (empId: string) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isAdityaGateOpen?: boolean;
  onToggleAdityaGate?: () => void;
  isGirirajGateOpen?: boolean;
  onToggleGirirajGate?: () => void;
  isConferenceGateOpen?: boolean;
  onToggleConferenceGate?: () => void;
  isRestroomGateOpen?: boolean;
  onToggleRestroomGate?: () => void;
}

export const OfficeScene: React.FC<OfficeSceneProps> = ({
  employees,
  speechMap,
  selectedEmployeeId,
  onSelectEmployee,
  onSelectZone,
  cameraPreset,
  speedMultiplier,
  performanceMode,
  followedEmployee,
  activeRoutePoints,
  isWalkMode = false,
  onToggleWalkMode,
  isGateOpen = false,
  onToggleGate,
  onTalkToEmployee,
  activeDialogueEmployeeId = null,
  nearestEmployeeId = null,
  onLeaveEmployeeZone,
  isFullscreen = false,
  onToggleFullscreen,
  isAdityaGateOpen = false,
  onToggleAdityaGate,
  isGirirajGateOpen = false,
  onToggleGirirajGate,
  isConferenceGateOpen = false,
  onToggleConferenceGate,
  isRestroomGateOpen = false,
  onToggleRestroomGate
}) => {
  const controlsRef = useRef<any>(null);
  const [currentNearestId, setCurrentNearestId] = useState<string | null>(null);

  // Zoom In (+25% closer)
  const handleZoomIn = useCallback(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const camera = controls.object;
    const target = controls.target;

    const offset = camera.position.clone().sub(target);
    const currentDist = offset.length();
    const newDist = Math.max(controls.minDistance, currentDist * 0.75);

    offset.normalize().multiplyScalar(newDist);
    camera.position.copy(target.clone().add(offset));
    controls.update();
  }, []);

  // Zoom Out (-30% further)
  const handleZoomOut = useCallback(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const camera = controls.object;
    const target = controls.target;

    const offset = camera.position.clone().sub(target);
    const currentDist = offset.length();
    const newDist = Math.min(controls.maxDistance, currentDist * 1.3);

    offset.normalize().multiplyScalar(newDist);
    camera.position.copy(target.clone().add(offset));
    controls.update();
  }, []);

  // Reset View to Office Overview
  const handleResetView = useCallback(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    controls.target.set(0, 0, 0);
    controls.object.position.set(0, 22, 26);
    controls.update();
  }, []);

  // Top-Down Architectural Layout
  const handleTopDownView = useCallback(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    controls.target.set(0, 0, 0);
    controls.object.position.set(0, 36, 0.05);
    controls.update();
  }, []);

  return (
    <div className="w-full h-full relative select-none bg-slate-950">
      <Canvas
        shadows={!performanceMode}
        camera={{ position: [0, 2.4, 18.6], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15
        }}
      >
        {/* Photorealistic Room Environment & Specular Reflections */}
        <RealisticStudioLighting />

        <CameraController
          preset={cameraPreset}
          followedEmployee={followedEmployee}
          controlsRef={controlsRef}
          isWalkMode={isWalkMode}
        />

        <OrbitControls
          ref={controlsRef}
          enabled={!isWalkMode}
          enableDamping={true}
          dampingFactor={0.08}
          minDistance={2.0}
          maxDistance={70}
          maxPolarAngle={Math.PI / 2 - 0.02}
          screenSpacePanning={true}
          zoomSpeed={1.4}
          rotateSpeed={0.85}
          panSpeed={1.1}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
          }}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
          }}
        />

        {/* Dynamic Walk-In Player Avatar (Baburao - Company Owner) */}
        <PlayerAvatar
          isActive={isWalkMode}
          employees={employees}
          onInspectEmployee={onSelectEmployee}
          controlsRef={controlsRef}
          onActivateWalkMode={onToggleWalkMode}
          onTalkToEmployee={onTalkToEmployee}
          activeDialogueEmployeeId={activeDialogueEmployeeId}
          onNearestEmployeeChange={setCurrentNearestId}
          onLeaveEmployeeZone={onLeaveEmployeeZone}
          onToggleGate={onToggleGate}
          isGateOpen={isGateOpen}
          isAdityaGateOpen={isAdityaGateOpen}
          onToggleAdityaGate={onToggleAdityaGate}
          isGirirajGateOpen={isGirirajGateOpen}
          onToggleGirirajGate={onToggleGirirajGate}
          isConferenceGateOpen={isConferenceGateOpen}
          onToggleConferenceGate={onToggleConferenceGate}
          isRestroomGateOpen={isRestroomGateOpen}
          onToggleRestroomGate={onToggleRestroomGate}
        />

        {/* Lighting Rig with Warmth and Shadow Mapping */}
        <ambientLight intensity={0.65} />
        <directionalLight
          position={[14, 24, 18]}
          intensity={1.3}
          castShadow={!performanceMode}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />
        {/* Soft Zone Accent Lights */}
        <pointLight position={[-14, 3.2, -10]} intensity={0.7} color="#93c5fd" distance={15} />
        <pointLight position={[13, 3.2, -10]} intensity={0.7} color="#c4b5fd" distance={15} />
        <pointLight position={[12.5, 3.2, 10.5]} intensity={0.8} color="#38bdf8" distance={12} />
        <pointLight position={[12.5, 3.2, 0.5]} intensity={0.7} color="#34d399" distance={12} />
        <pointLight position={[-14, 3.2, 0]} intensity={0.6} color="#f472b6" distance={12} />
        {/* Entrance Warm Chandelier Glow */}
        <pointLight position={[0, 3.5, 15.5]} intensity={0.9} color="#38bdf8" distance={10} />

        {/* Grounding Contact Shadows */}
        {!performanceMode && (
          <ContactShadows
            position={[0, 0.005, 0]}
            opacity={0.65}
            scale={46}
            blur={1.8}
            far={12}
            resolution={512}
            color="#020617"
          />
        )}

        {/* Architectural Floor Grid */}
        <Grid
          position={[0, 0.002, 0]}
          args={[40, 32]}
          cellSize={1.2}
          cellThickness={0.5}
          cellColor="#64748b"
          sectionSize={6}
          sectionThickness={1.0}
          sectionColor="#475569"
          fadeDistance={45}
          fadeStrength={1.5}
        />

        {/* Modern Skyscraper City Skyline Panorama outside West Glass Curtain */}
        <SkyscraperCityPanorama />

        {/* Suspended Modern Office Ceiling with Recessed LED Troffers */}
        <OfficeCeiling />

        {/* Complete Enclosed Office Architecture & Furniture */}
        <OfficeEnvironment
          onSelectZone={onSelectZone}
          isGateOpen={isGateOpen}
          onToggleGate={onToggleGate}
          isAdityaGateOpen={isAdityaGateOpen}
          onToggleAdityaGate={onToggleAdityaGate}
          isGirirajGateOpen={isGirirajGateOpen}
          onToggleGirirajGate={onToggleGirirajGate}
          isConferenceGateOpen={isConferenceGateOpen}
          onToggleConferenceGate={onToggleConferenceGate}
          isRestroomGateOpen={isRestroomGateOpen}
          onToggleRestroomGate={onToggleRestroomGate}
        />

        {/* 3D Active Reporting Route */}
        {activeRoutePoints.length > 1 && (
          <ReportingSplines routePoints={activeRoutePoints} color="#38bdf8" />
        )}

        {/* 18 Living Employees */}
        {employees.map((emp) => (
          <HumanoidCharacter
            key={emp.id}
            employee={emp}
            speech={speechMap[emp.id] || null}
            isSelected={selectedEmployeeId === emp.id}
            onSelect={onSelectEmployee}
            speedMultiplier={speedMultiplier}
            isOwnerNearby={isWalkMode && (currentNearestId === emp.id || activeDialogueEmployeeId === emp.id)}
          />
        ))}
      </Canvas>

      {/* Floating Touch / Mouse Navigation & Zoom Dock (Right Side) */}
      {!isWalkMode && (
        <div className="absolute right-4 bottom-5 flex flex-col items-center pointer-events-auto z-20">
          <div className="flex flex-col bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-2xl space-y-1.5">
            <button
              onClick={handleZoomIn}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white transition active:scale-90 shadow"
              title="Zoom In (+)"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white transition active:scale-90 shadow"
              title="Zoom Out (-)"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="w-full h-px bg-slate-700/60 my-0.5" />
            <button
              onClick={handleResetView}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white transition active:scale-90 shadow"
              title="Reset 3D Perspective"
              aria-label="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleTopDownView}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white transition active:scale-90 shadow"
              title="Top-Down Architectural Floor Plan"
              aria-label="Top-Down View"
            >
              <Compass className="w-4 h-4" />
            </button>
            {onToggleFullscreen && (
              <>
                <div className="w-full h-px bg-slate-700/60 my-0.5" />
                <button
                  onClick={onToggleFullscreen}
                  className={`p-2.5 rounded-xl transition active:scale-90 shadow ${
                    isFullscreen
                      ? 'bg-sky-600 text-white shadow-[0_0_12px_#38bdf8]'
                      : 'bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white'
                  }`}
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
                  aria-label="Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Walking Controls Banner & Virtual Touch / Mouse D-Pad when in Walk Mode */}
      {isWalkMode ? (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center gap-2 z-30">
          <div className="flex items-center space-x-3 bg-slate-950/95 backdrop-blur-xl px-4 py-1.5 rounded-2xl border-2 border-emerald-400 text-xs text-white font-mono font-bold shadow-[0_0_25px_rgba(16,185,129,0.4)]">
            <Footprints className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>WALK MODE: W/A/S/D or Arrows to move • [E] to talk • [ESC] to exit</span>
            {onToggleWalkMode && (
              <button
                onClick={onToggleWalkMode}
                className="ml-2 px-2 py-0.5 bg-slate-800 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg text-[10px] transition font-bold"
              >
                Exit [ESC]
              </button>
            )}
          </div>

          {/* Virtual On-Screen Walking Pad */}
          <div className="flex items-center space-x-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-2xl">
            <button
              onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', code: 'KeyA' }))}
              onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', code: 'KeyA' }))}
              onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', code: 'KeyA' }))}
              onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', code: 'KeyA' }))}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 active:bg-emerald-500 text-slate-200 hover:text-white font-bold text-xs select-none"
              title="Turn Left"
            >
              ◄ Left
            </button>
            <button
              onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w', code: 'KeyW' }))}
              onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w', code: 'KeyW' }))}
              onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w', code: 'KeyW' }))}
              onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w', code: 'KeyW' }))}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs shadow-[0_0_15px_rgba(16,185,129,0.5)] select-none"
              title="Step Forward"
            >
              ▲ Walk In (W)
            </button>
            <button
              onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', code: 'KeyS' }))}
              onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 's', code: 'KeyS' }))}
              onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', code: 'KeyS' }))}
              onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 's', code: 'KeyS' }))}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 active:bg-emerald-500 text-slate-200 hover:text-white font-bold text-xs select-none"
              title="Step Back"
            >
              ▼ Back
            </button>
            <button
              onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd', code: 'KeyD' }))}
              onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'd', code: 'KeyD' }))}
              onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd', code: 'KeyD' }))}
              onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'd', code: 'KeyD' }))}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 active:bg-emerald-500 text-slate-200 hover:text-white font-bold text-xs select-none"
              title="Turn Right"
            >
              Right ►
            </button>
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', code: 'KeyE' }))}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow select-none"
              title="Interact / Talk"
            >
              💬 Talk [E]
            </button>
            {onToggleGate && (
              <button
                onClick={onToggleGate}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs shadow select-none transition ${
                  isGateOpen ? 'bg-rose-700 hover:bg-rose-600 text-white' : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                }`}
                title="Toggle South Entrance Gate [G]"
              >
                {isGateOpen ? '🔒 Gate [G]' : '🚪 Open Gate [G]'}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Helpful Navigation Hint (Center Bottom) + Walk In Button */
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center space-x-3 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-sky-500/40 text-[11px] text-slate-200 font-medium shadow-2xl z-10">
          <button
            onClick={onToggleWalkMode}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)] transition active:scale-95"
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>ENTER & WALK IN</span>
          </button>
          <span className="text-slate-600">•</span>
          <span>👆 Orbit: Left-Click</span>
          <span className="text-slate-600">•</span>
          <span>✌️ Pan: Right-Click</span>
          <span className="text-slate-600">•</span>
          <span>🔍 Zoom: Scroll</span>
          <span className="text-slate-600">•</span>
          <span>⌨️ Tour Units: [ / ] or ◄ / ►</span>
        </div>
      )}
    </div>
  );
};
