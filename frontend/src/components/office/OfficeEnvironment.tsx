import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { gameAudio } from '../../utils/gameAudio';
import {
  createWoodFloorTexture,
  createCarpetTexture,
  createCodeScreenTexture,
  createWhiteboardTexture
} from '../../utils/officeTextures';

interface OfficeEnvironmentProps {
  onSelectZone?: (zoneName: string) => void;
  isGateOpen?: boolean;
  onToggleGate?: () => void;
  isAdityaGateOpen?: boolean;
  onToggleAdityaGate?: () => void;
  isGirirajGateOpen?: boolean;
  onToggleGirirajGate?: () => void;
  isConferenceGateOpen?: boolean;
  onToggleConferenceGate?: () => void;
  isRestroomGateOpen?: boolean;
  onToggleRestroomGate?: () => void;
}

// Ergonomic 5-Star Castor Base Office Chair
const RealisticOfficeChair: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({
  position,
  rotationY = 0
}) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    {/* 5-Star Spider Castor Base */}
    <group position={[0, 0.05, 0]}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.sin(rad) * 0.16;
        const z = Math.cos(rad) * 0.16;
        const wx = Math.sin(rad) * 0.28;
        const wz = Math.cos(rad) * 0.28;
        return (
          <React.Fragment key={`castor-${i}`}>
            {/* Spoke */}
            <mesh position={[x, 0.02, z]} rotation={[0, rad, 0]}>
              <boxGeometry args={[0.04, 0.025, 0.26]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Wheel */}
            <mesh position={[wx, 0.035, wz]}>
              <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
              <meshStandardMaterial color="#020617" roughness={0.6} />
            </mesh>
          </React.Fragment>
        );
      })}
    </group>

    {/* Chrome Gas-Lift Piston */}
    <mesh position={[0, 0.25, 0]}>
      <cylinderGeometry args={[0.028, 0.028, 0.35, 16]} />
      <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
    </mesh>

    {/* Ergonomic Molded Seat Cushion */}
    <mesh position={[0, 0.46, 0]} castShadow>
      <boxGeometry args={[0.54, 0.07, 0.52]} />
      <meshStandardMaterial color="#0f172a" roughness={0.7} />
    </mesh>

    {/* Lumbar Support Spine & Mesh Backrest */}
    <group position={[0, 0.46, -0.24]}>
      {/* Chrome spine */}
      <mesh position={[0, 0.25, -0.04]}>
        <boxGeometry args={[0.06, 0.45, 0.03]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Mesh Back */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.48, 0.65, 0.04]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
    </group>

    {/* Adjustable 3D Armrests (Left & Right) */}
    {[-0.27, 0.27].map((ax, idx) => (
      <group key={`armrest-${idx}`} position={[ax, 0.58, -0.05]}>
        <mesh position={[0, -0.08, 0]}>
          <boxGeometry args={[0.03, 0.16, 0.03]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.08, 0.025, 0.24]} />
          <meshStandardMaterial color="#020617" roughness={0.5} />
        </mesh>
      </group>
    ))}
  </group>
);

// High-Fidelity Dual-Monitor Developer Workstation
const RealisticDeveloperDesk: React.FC<{
  position: [number, number, number];
  codeScreen1: THREE.CanvasTexture;
  codeScreen2: THREE.CanvasTexture;
  keyboardColor?: string;
}> = ({ position, codeScreen1, codeScreen2, keyboardColor = '#38bdf8' }) => (
  <group position={position}>
    {/* Chamfered Workstation Top (Deep charcoal architectural matte) */}
    <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
      <boxGeometry args={[2.1, 0.05, 1.15]} />
      <meshStandardMaterial color="#181e29" roughness={0.35} metalness={0.15} />
    </mesh>

    {/* Heavy-Duty Steel C-Frame Legs with Leveling Glides */}
    {[-0.95, 0.95].map((lx, idx) => (
      <group key={`desk-leg-${idx}`} position={[lx, 0, 0]}>
        {/* Vertical Leg Pillar */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.08, 0.7, 0.08]} />
          <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Floor Foot with leveling glide */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.1, 0.04, 0.95]} />
          <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Desktop Support Bracket */}
        <mesh position={[0, 0.69, 0]}>
          <boxGeometry args={[0.1, 0.03, 0.9]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
      </group>
    ))}

    {/* Dual Articulated Monitor Arms Clamped to Desk Rear */}
    <group position={[0, 0.75, -0.48]}>
      {/* Heavy-duty Desk Clamp Base */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Vertical Column */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.35, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Articulated Cross Arms */}
      <mesh position={[-0.25, 0.32, 0.08]} rotation={[0, 0.25, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.04]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      <mesh position={[0.25, 0.32, 0.08]} rotation={[0, -0.25, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.04]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
    </group>

    {/* Primary 27" Curved Code Display (Left) */}
    <group position={[-0.48, 1.15, -0.24]} rotation={[0, 0.14, 0]}>
      {/* Bezel */}
      <mesh castShadow>
        <boxGeometry args={[0.88, 0.54, 0.025]} />
        <meshStandardMaterial color="#020617" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Rendered Syntax-Highlighted IDE Screen Texture */}
      <mesh position={[0, 0, 0.014]}>
        <planeGeometry args={[0.85, 0.51]} />
        <meshStandardMaterial map={codeScreen1} roughness={0.2} />
      </mesh>
    </group>

    {/* Secondary 27" Code Display (Right) */}
    <group position={[0.48, 1.15, -0.24]} rotation={[0, -0.14, 0]}>
      {/* Bezel */}
      <mesh castShadow>
        <boxGeometry args={[0.88, 0.54, 0.025]} />
        <meshStandardMaterial color="#020617" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Rendered Syntax-Highlighted IDE Screen Texture */}
      <mesh position={[0, 0, 0.014]}>
        <planeGeometry args={[0.85, 0.51]} />
        <meshStandardMaterial map={codeScreen2} roughness={0.2} />
      </mesh>
    </group>

    {/* Black Leather Desk Blotter Pad */}
    <mesh position={[0, 0.746, 0.12]}>
      <boxGeometry args={[0.95, 0.004, 0.48]} />
      <meshStandardMaterial color="#0f172a" roughness={0.9} />
    </mesh>

    {/* Mechanical RGB Backlit Keyboard */}
    <mesh position={[0, 0.755, 0.16]}>
      <boxGeometry args={[0.52, 0.018, 0.18]} />
      <meshStandardMaterial color="#020617" emissive={keyboardColor} emissiveIntensity={0.35} />
    </mesh>

    {/* Ergonomic Optical Mouse with Glowing Sensor */}
    <mesh position={[0.36, 0.755, 0.16]}>
      <boxGeometry args={[0.07, 0.025, 0.12]} />
      <meshStandardMaterial color="#020617" emissive="#38bdf8" emissiveIntensity={0.2} />
    </mesh>

    {/* Ceramic Coffee Mug with Realistic Handle */}
    <group position={[0.68, 0.748, -0.18]}>
      <mesh>
        <cylinderGeometry args={[0.045, 0.04, 0.11, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.15} />
      </mesh>
      {/* Dark Espresso liquid */}
      <mesh position={[0, 0.045, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
        <meshStandardMaterial color="#2d1500" roughness={0.1} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.05, 0, 0]}>
        <torusGeometry args={[0.03, 0.008, 8, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.15} />
      </mesh>
    </group>

    {/* Matching Realistic Office Chair */}
    <RealisticOfficeChair position={[0, 0, 0.62]} rotationY={Math.PI} />
  </group>
);


// Modern 3-Seater Executive Lounge Sofa (Break Area, Max Capacity 3)
const ExecutiveLoungeSofa: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Plush Area Carpet under Sofa */}
    <mesh position={[0, 0.004, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[4.4, 3.2]} />
      <meshStandardMaterial color="#1e1b4b" roughness={0.8} />
    </mesh>

    {/* Sofa Main Frame (Walnut Base) */}
    <mesh position={[0, 0.16, 0]} castShadow>
      <boxGeometry args={[3.2, 0.22, 1.1]} />
      <meshStandardMaterial color="#1c1917" roughness={0.6} />
    </mesh>
    {/* Chrome Stiletto Legs */}
    {[-1.5, 1.5].map((lx, i) =>
      [-0.45, 0.45].map((lz, j) => (
        <mesh key={`sofa-leg-${i}-${j}`} position={[lx, 0.06, lz]}>
          <cylinderGeometry args={[0.025, 0.015, 0.12, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>
      ))
    )}

    {/* 3 Plush Leather Seat Cushions (Max Capacity 3) */}
    {[-0.95, 0, 0.95].map((cx, idx) => (
      <mesh key={`seat-${idx}`} position={[cx, 0.35, 0.05]} castShadow>
        <boxGeometry args={[0.92, 0.18, 0.88]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>
    ))}

    {/* Sofa Backrest Cushion */}
    <mesh position={[0, 0.62, -0.42]} castShadow>
      <boxGeometry args={[3.1, 0.45, 0.24]} />
      <meshStandardMaterial color="#0f172a" roughness={0.65} />
    </mesh>

    {/* Left & Right Armrests */}
    {[-1.55, 1.55].map((ax, idx) => (
      <mesh key={`arm-${idx}`} position={[ax, 0.52, 0]} castShadow>
        <boxGeometry args={[0.18, 0.36, 1.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
    ))}

    {/* Low Marble Coffee Table */}
    <group position={[0, 0, 1.3]}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[2.0, 0.06, 0.75]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.15} />
      </mesh>
      {[-0.85, 0.85].map((tx, idx) => (
        <mesh key={`table-leg-${idx}`} position={[tx, 0.14, 0]}>
          <boxGeometry args={[0.04, 0.28, 0.65]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
      ))}
      <mesh position={[-0.3, 0.33, 0]}>
        <cylinderGeometry args={[0.04, 0.035, 0.08, 12]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.2} />
      </mesh>
      <mesh position={[0.3, 0.32, 0]}>
        <boxGeometry args={[0.24, 0.01, 0.32]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.3} />
      </mesh>
    </group>

    {/* Discreet Lounge Label */}
    <Html position={[0, 1.1, 0]} center style={{ pointerEvents: 'none' }}>
      <span className="text-[7.5px] font-mono font-bold text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/40 uppercase tracking-tight shadow">
        🛋️ LOUNGE SOFA (MAX 3)
      </span>
    </Html>
  </group>
);

// Modern Restrooms Portal with Animated Interactive Door
const RestroomsPortal: React.FC<{
  position: [number, number, number];
  isOpen?: boolean;
  onToggle?: () => void;
}> = ({ position, isOpen = false, onToggle }) => (
  <group position={position}>
    {/* Door Frame */}
    <mesh position={[0, 1.6, 0]}>
      <boxGeometry args={[0.12, 3.2, 1.8]} />
      <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.4} />
    </mesh>

    {/* Lit Interior Cavity */}
    {isOpen && (
      <group position={[-0.4, 1.5, 0]}>
        <pointLight color="#38bdf8" intensity={1.8} distance={3} />
        {/* Porcelain Sink Mirror Vanity */}
        <mesh position={[-0.2, 0.9, 0]}>
          <boxGeometry args={[0.4, 0.1, 0.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.1} />
        </mesh>
      </group>
    )}

    {/* Animated Door Leaf (Slides / Swings open) */}
    <group position={[0.03, 1.5, isOpen ? -1.3 : 0]}>
      <mesh>
        <boxGeometry args={[0.05, 3.0, 1.5]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Matte Chrome Vertical Handle */}
      <mesh position={[0.04, 0, 0.55]}>
        <cylinderGeometry args={[0.016, 0.016, 0.65, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
      </mesh>
    </group>

    {/* Restroom Header Sign & Interactive Toggle */}
    <Html position={[0.08, 2.7, 0]} center>
      <div
        onClick={onToggle}
        className="cursor-pointer px-2.5 py-1 bg-slate-950/95 border border-sky-400 text-sky-300 text-[10px] font-mono font-black rounded-lg shadow-[0_0_15px_#38bdf8] flex items-center space-x-1.5 whitespace-nowrap hover:bg-sky-950/80 hover:scale-105 transition"
      >
        <span>🚻</span>
        <span>RESTROOMS</span>
        <span className={`text-[8px] font-bold px-1 rounded ${isOpen ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
          {isOpen ? 'OPEN' : 'CLOSED'}
        </span>
      </div>
    </Html>
  </group>
);
export const OfficeEnvironment: React.FC<OfficeEnvironmentProps> = ({
  onSelectZone,
  isGateOpen = false,
  onToggleGate,
  isAdityaGateOpen = false,
  onToggleAdityaGate,
  isGirirajGateOpen = false,
  onToggleGirirajGate,
  isConferenceGateOpen = false,
  onToggleConferenceGate,
  isRestroomGateOpen = false,
  onToggleRestroomGate
}) => {
  // Generate photorealistic procedural textures once
  const woodFloorTex = useMemo(() => createWoodFloorTexture(), []);
  const execCarpetTex = useMemo(() => createCarpetTexture('#0c131f'), []);
  const leadCarpetTex = useMemo(() => createCarpetTexture('#181429'), []);
  const qaCarpetTex = useMemo(() => createCarpetTexture('#06241a'), []);
  const devopsCarpetTex = useMemo(() => createCarpetTexture('#1f140a'), []);
  const confCarpetTex = useMemo(() => createCarpetTexture('#1c0f24'), []);

  const screenTex1 = useMemo(() => createCodeScreenTexture('#38bdf8', 'orchestrator.ts'), []);
  const screenTex2 = useMemo(() => createCodeScreenTexture('#10b981', 'test_suite.py'), []);
  const screenTex3 = useMemo(() => createCodeScreenTexture('#c084fc', 'state_machine.rs'), []);
  const screenTex4 = useMemo(() => createCodeScreenTexture('#fb923c', 'deploy_vm.yaml'), []);
  const whiteboardTex = useMemo(() => createWhiteboardTexture('WE-CONNECT SOLUTIONS ARCHITECTURE'), []);

  const handleZoneClick = (zone: string) => {
    gameAudio.playWhoosh();
    if (onSelectZone) onSelectZone(zone);
  };

  return (
    <group>
      {/* ==================== 1. REALISTIC ENCLOSED OFFICE ARCHITECTURE ==================== */}

      {/* Main Wood Plank Flooring with Real PBR Seams */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 32]} />
        <meshStandardMaterial map={woodFloorTex} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Modern Perimeter Baseboards */}
      <mesh position={[0, 0.08, -15.9]}>
        <boxGeometry args={[40, 0.16, 0.08]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.08, 15.9]}>
        <boxGeometry args={[40, 0.16, 0.08]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      <mesh position={[-19.9, 0.08, 0]}>
        <boxGeometry args={[0.08, 0.16, 31.8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      <mesh position={[19.9, 0.08, 0]}>
        <boxGeometry args={[0.08, 0.16, 31.8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>

      {/* North Wall: Executive Acoustic Panels */}
      <group position={[0, 2.0, -15.9]}>
        <mesh receiveShadow>
          <boxGeometry args={[40, 4.0, 0.2]} />
          <meshStandardMaterial color="#64748b" roughness={0.65} metalness={0.1} />
        </mesh>
        {[-15, -10, -5, 0, 5, 10, 15].map((x, i) => (
          <mesh key={`slat-${i}`} position={[x, 0, 0.11]}>
            <boxGeometry args={[3.8, 3.4, 0.04]} />
            <meshStandardMaterial color="#475569" roughness={0.7} metalness={0.15} />
          </mesh>
        ))}
        {/* Recessed Ambient Cove Light Strip */}
        <mesh position={[0, 1.95, 0.12]}>
          <boxGeometry args={[39.6, 0.06, 0.06]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.2} />
        </mesh>
      </group>

      {/* South Wall: Entrance Doors & Reception Portal */}
      <group position={[0, 2.0, 15.9]}>
        <mesh position={[-11, 0, 0]} receiveShadow>
          <boxGeometry args={[18, 4.0, 0.2]} />
          <meshStandardMaterial color="#64748b" roughness={0.65} metalness={0.1} />
        </mesh>
        <mesh position={[11, 0, 0]} receiveShadow>
          <boxGeometry args={[18, 4.0, 0.2]} />
          <meshStandardMaterial color="#64748b" roughness={0.65} metalness={0.1} />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[4.2, 1.0, 0.2]} />
          <meshStandardMaterial color="#161b22" roughness={0.5} metalness={0.6} />
        </mesh>

        {/* Double Sliding Glass Doors (Animated / Openable) */}
        {/* Left Sliding Door */}
        <group position={[isGateOpen ? -2.45 : -1.0, -0.5, 0]}>
          <mesh>
            <boxGeometry args={[1.9, 3.0, 0.06]} />
            <meshPhysicalMaterial color="#93c5fd" transparent opacity={0.35} roughness={0.05} transmission={0.8} />
          </mesh>
          <mesh position={[0.85, 0, 0.05]}>
            <cylinderGeometry args={[0.02, 0.02, 1.2, 12]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>

        {/* Right Sliding Door */}
        <group position={[isGateOpen ? 2.45 : 1.0, -0.5, 0]}>
          <mesh>
            <boxGeometry args={[1.9, 3.0, 0.06]} />
            <meshPhysicalMaterial color="#93c5fd" transparent opacity={0.35} roughness={0.05} transmission={0.8} />
          </mesh>
          <mesh position={[-0.85, 0, 0.05]}>
            <cylinderGeometry args={[0.02, 0.02, 1.2, 12]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>

        {/* Minimal Subtle Gate Header Label & Toggle Button (Tiny Words) */}
        <Html position={[0, 1.45, -0.15]} center style={{ pointerEvents: 'auto' }}>
          <div className="flex flex-col items-center gap-1 pointer-events-auto select-none">
            <span className="text-[7.5px] font-mono font-bold text-sky-400 bg-slate-950/85 px-1.5 py-0.2 rounded border border-slate-700/60 uppercase tracking-tight">
              We-Connect Gate
            </span>
            {onToggleGate && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleGate();
                }}
                className={`cursor-pointer px-2 py-0.5 rounded-md text-[8px] font-mono font-bold border transition select-none shadow ${
                  isGateOpen
                    ? 'bg-rose-950/90 hover:bg-rose-900 text-rose-300 border-rose-500/50'
                    : 'bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 border-emerald-500/50'
                }`}
              >
                {isGateOpen ? '🔒 Gate Closed [G]' : '🔓 Open Gate [G]'}
              </button>
            )}
          </div>
        </Html>
      </group>

      {/* West Panoramic Curtain Wall */}
      <group position={[-19.9, 2.0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.1, 4.0, 31.8]} />
          <meshPhysicalMaterial color="#38bdf8" transparent opacity={0.18} roughness={0.05} transmission={0.9} />
        </mesh>
        {[-12, -8, -4, 0, 4, 8, 12].map((z, idx) => (
          <mesh key={`mullion-${idx}`} position={[0.06, 0, z]}>
            <boxGeometry args={[0.08, 4.0, 0.12]} />
            <meshStandardMaterial color="#0f172a" metalness={0.85} />
          </mesh>
        ))}
      </group>

      {/* East Feature Wall */}
      <group position={[19.9, 2.0, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.1, 4.0, 31.8]} />
          <meshStandardMaterial color="#64748b" roughness={0.65} metalness={0.1} />
        </mesh>
      </group>

      {/* ==================== 2. SUSPENDED ARCHITECTURAL TROFFER LIGHTS ==================== */}
      {[
        [-13.5, -9.5],
        [13.0, -9.5],
        [-4, 2],
        [4, 2],
        [0, 6],
        [13.0, 0.5],
        [13.0, 10.5],
        [-13.5, 0]
      ].map(([tx, tz], i) => (
        <group key={`troffer-${i}`} position={[tx, 3.8, tz]}>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[2.4, 0.08, 0.6]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[2.3, 0.5]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.9} />
          </mesh>
        </group>
      ))}

      {/* ==================== 3. EXECUTIVE SUITE (ADITYA JAIN) ==================== */}
      <mesh position={[-13.5, 0.005, -9.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8.8, 7.8]} />
        <meshStandardMaterial map={execCarpetTex} roughness={0.7} />
      </mesh>
      <lineSegments position={[-13.5, 0.015, -9.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(8.8, 7.8)]} />
        <lineBasicMaterial color="#38bdf8" />
      </lineSegments>

      {/* Glass Partition with Aluminum Header & Base Tracks */}
      <group position={[-13.5, 1.5, -9.5]}>
        <mesh position={[-2.1, 0, 3.85]}>
          <boxGeometry args={[4.4, 3, 0.08]} />
          <meshPhysicalMaterial color="#93c5fd" transparent opacity={0.35} roughness={0.08} transmission={0.75} />
        </mesh>
        {/* Neon Track */}
        <mesh position={[-2.1, 1.52, 3.85]}>
          <boxGeometry args={[4.4, 0.06, 0.12]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[4.35, 0, 0]}>
          <boxGeometry args={[0.08, 3, 7.7]} />
          <meshPhysicalMaterial color="#93c5fd" transparent opacity={0.35} roughness={0.08} transmission={0.75} />
        </mesh>
        <mesh position={[4.35, 1.52, 0]}>
          <boxGeometry args={[0.12, 0.06, 7.7]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.5} />
        </mesh>
        <Html position={[-2.1, 2.7, 3.9]} center distanceFactor={14}>
          <div
            onClick={() => handleZoneClick('Executive Cabin')}
            className="cursor-pointer px-3.5 py-1.5 bg-slate-950/90 text-sky-300 border-2 border-sky-400 rounded-xl text-xs font-black tracking-widest shadow-[0_0_15px_rgba(56,189,248,0.5)] backdrop-blur-md whitespace-nowrap hover:scale-105 transition-all font-mono"
          >
            👑 EXECUTIVE CABIN • ADITYA JAIN
          </div>
        </Html>
      </group>

      {/* Aditya's Executive Desk & Triple Curved OLED Displays */}
      <group position={[-14, 0, -10]}>
        <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.08, 1.4]} />
          <meshStandardMaterial color="#1c1917" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.785, 0]}>
          <boxGeometry args={[3.42, 0.015, 1.42]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-1.5, 0.37, 0]}>
          <boxGeometry args={[0.1, 0.74, 1.2]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
        <mesh position={[1.5, 0.37, 0]}>
          <boxGeometry args={[0.1, 0.74, 1.2]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>

        {/* Triple Ultra-Wide Curved OLED Displays */}
        <group position={[0, 1.25, -0.3]}>
          <mesh>
            <boxGeometry args={[2.0, 0.65, 0.03]} />
            <meshStandardMaterial color="#020617" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.018]}>
            <planeGeometry args={[1.94, 0.6]} />
            <meshStandardMaterial map={screenTex1} roughness={0.15} />
          </mesh>
        </group>

        {/* Executive Leather Desk Blotter Pad */}
        <mesh position={[0, 0.77, 0.18]}>
          <boxGeometry args={[1.2, 0.008, 0.55]} />
          <meshStandardMaterial color="#0c0a09" roughness={0.8} />
        </mesh>
        {/* Executive Gold-Accent Mechanical Keyboard */}
        <mesh position={[0, 0.78, 0.22]}>
          <boxGeometry args={[0.54, 0.02, 0.18]} />
          <meshStandardMaterial color="#020617" emissive="#fbbf24" emissiveIntensity={0.3} />
        </mesh>
        {/* Precision Wireless Mouse */}
        <mesh position={[0.42, 0.78, 0.22]}>
          <boxGeometry args={[0.07, 0.025, 0.12]} />
          <meshStandardMaterial color="#020617" emissive="#38bdf8" emissiveIntensity={0.3} />
        </mesh>

        {/* Realistic Executive Leather Chair facing North towards desk */}
        <RealisticOfficeChair position={[0, 0, 0.68]} rotationY={Math.PI} />
      </group>

      {/* ==================== 4. SENIOR LEAD CABIN (GIRIRAJ MALI) ==================== */}
      <mesh position={[13.0, 0.005, -9.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8.8, 7.8]} />
        <meshStandardMaterial map={leadCarpetTex} roughness={0.7} />
      </mesh>
      <lineSegments position={[13.0, 0.015, -9.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(8.8, 7.8)]} />
        <lineBasicMaterial color="#c084fc" />
      </lineSegments>

      <group position={[13.0, 1.5, -9.5]}>
        <mesh position={[2.1, 0, 3.85]}>
          <boxGeometry args={[4.4, 3, 0.08]} />
          <meshPhysicalMaterial color="#c4b5fd" transparent opacity={0.35} roughness={0.08} transmission={0.75} />
        </mesh>
        <mesh position={[2.1, 1.52, 3.85]}>
          <boxGeometry args={[4.4, 0.06, 0.12]} />
          <meshStandardMaterial color="#c084fc" emissive="#9333ea" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[-4.35, 0, 0]}>
          <boxGeometry args={[0.08, 3, 7.7]} />
          <meshPhysicalMaterial color="#c4b5fd" transparent opacity={0.35} roughness={0.08} transmission={0.75} />
        </mesh>
        <mesh position={[-4.35, 1.52, 0]}>
          <boxGeometry args={[0.12, 0.06, 7.7]} />
          <meshStandardMaterial color="#c084fc" emissive="#9333ea" emissiveIntensity={1.5} />
        </mesh>
        <Html position={[2.1, 2.7, 3.9]} center distanceFactor={14}>
          <div
            onClick={() => handleZoneClick('Senior Engineering Cabin')}
            className="cursor-pointer px-3.5 py-1.5 bg-slate-950/90 text-purple-300 border-2 border-purple-400 rounded-xl text-xs font-black tracking-widest shadow-[0_0_15px_rgba(192,132,252,0.5)] backdrop-blur-md whitespace-nowrap hover:scale-105 transition-all font-mono"
          >
            ⚡ LEAD CABIN • GIRIRAJ MALI
          </div>
        </Html>
      </group>

      {/* Giriraj's Workstation Desk */}
      <group position={[13.0, 0, -10]}>
        <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.08, 1.4]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.3} metalness={0.2} />
        </mesh>
        <group position={[-0.7, 1.25, -0.3]} rotation={[0, 0.16, 0]}>
          <mesh>
            <boxGeometry args={[1.1, 0.65, 0.03]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
          <mesh position={[0, 0, 0.018]}>
            <planeGeometry args={[1.05, 0.6]} />
            <meshStandardMaterial map={screenTex3} roughness={0.15} />
          </mesh>
        </group>
        <group position={[0.7, 1.25, -0.3]} rotation={[0, -0.16, 0]}>
          <mesh>
            <boxGeometry args={[1.1, 0.65, 0.03]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
          <mesh position={[0, 0, 0.018]}>
            <planeGeometry args={[1.05, 0.6]} />
            <meshStandardMaterial map={screenTex1} roughness={0.15} />
          </mesh>
        </group>

        {/* Architecture Whiteboard with DAG Flowchart on North Wall */}
        <mesh position={[0, 2.2, -3.78]}>
          <planeGeometry args={[5.0, 2.2]} />
          <meshStandardMaterial map={whiteboardTex} roughness={0.2} />
        </mesh>

        {/* Lead Engineer Keyboard & Mouse */}
        <mesh position={[0, 0.77, 0.18]}>
          <boxGeometry args={[0.54, 0.02, 0.18]} />
          <meshStandardMaterial color="#020617" emissive="#c084fc" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0.38, 0.78, 0.18]}>
          <boxGeometry args={[0.07, 0.025, 0.12]} />
          <meshStandardMaterial color="#020617" emissive="#38bdf8" emissiveIntensity={0.25} />
        </mesh>

        {/* Realistic Lead Office Chair facing North towards desk */}
        <RealisticOfficeChair position={[0, 0, 0.68]} rotationY={Math.PI} />
      </group>

      {/* ==================== 5. OPEN DEVELOPER & OPERATIONS PODS ==================== */}
      {/* Operations & Security Pod (Sanjay Sahlot & Harshit Masta) */}
      <RealisticDeveloperDesk position={[-7, 0, -10]} codeScreen1={screenTex1} codeScreen2={screenTex3} keyboardColor="#0284c7" />
      <RealisticDeveloperDesk position={[-7, 0, -6]} codeScreen1={screenTex4} codeScreen2={screenTex2} keyboardColor="#ef4444" />

      {/* UI/UX Design Studio Workstation (Esha Saini) */}
      <RealisticDeveloperDesk position={[-14, 0, 6]} codeScreen1={screenTex3} codeScreen2={screenTex1} keyboardColor="#ec4899" />

      {/* Developer Pod Columns */}
      <RealisticDeveloperDesk position={[-4, 0, -2]} codeScreen1={screenTex1} codeScreen2={screenTex2} keyboardColor="#38bdf8" />
      <RealisticDeveloperDesk position={[-4, 0, 2]} codeScreen1={screenTex2} codeScreen2={screenTex3} keyboardColor="#06b6d4" />
      <RealisticDeveloperDesk position={[-4, 0, 6]} codeScreen1={screenTex3} codeScreen2={screenTex1} keyboardColor="#0ea5e9" />

      <RealisticDeveloperDesk position={[0, 0, -2]} codeScreen1={screenTex1} codeScreen2={screenTex3} keyboardColor="#c084fc" />
      <RealisticDeveloperDesk position={[0, 0, 2]} codeScreen1={screenTex2} codeScreen2={screenTex4} keyboardColor="#a855f7" />
      <RealisticDeveloperDesk position={[0, 0, 6]} codeScreen1={screenTex3} codeScreen2={screenTex2} keyboardColor="#e879f9" />

      <RealisticDeveloperDesk position={[4, 0, -2]} codeScreen1={screenTex2} codeScreen2={screenTex1} keyboardColor="#3b82f6" />
      <RealisticDeveloperDesk position={[4, 0, 2]} codeScreen1={screenTex1} codeScreen2={screenTex4} keyboardColor="#2563eb" />
      <RealisticDeveloperDesk position={[4, 0, 6]} codeScreen1={screenTex4} codeScreen2={screenTex2} keyboardColor="#0284c7" />

      {/* ==================== 6. QA TESTING LAB (ABHISHEK & ASHISH) ==================== */}
      <mesh position={[13.0, 0.005, 0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8.8, 7.5]} />
        <meshStandardMaterial map={qaCarpetTex} roughness={0.7} />
      </mesh>
      <group position={[13.0, 1.5, 0.5]}>
        <mesh position={[-4.35, 0, 0]}>
          <boxGeometry args={[0.08, 3, 7.5]} />
          <meshPhysicalMaterial color="#6ee7b7" transparent opacity={0.35} roughness={0.08} transmission={0.75} />
        </mesh>
        <mesh position={[-4.35, 1.52, 0]}>
          <boxGeometry args={[0.12, 0.06, 7.5]} />
          <meshStandardMaterial color="#34d399" emissive="#059669" emissiveIntensity={1.5} />
        </mesh>
        <Html position={[0, 2.7, -3.7]} center distanceFactor={14}>
          <div
            onClick={() => handleZoneClick('QA Testing Lab')}
            className="cursor-pointer px-3.5 py-1.5 bg-slate-950/90 text-emerald-300 border-2 border-emerald-400 rounded-xl text-xs font-black tracking-widest shadow-[0_0_15px_rgba(52,211,153,0.5)] backdrop-blur-md whitespace-nowrap hover:scale-105 transition-all font-mono"
          >
            🧪 QA LAB • ABHISHEK & ASHISH
          </div>
        </Html>
      </group>

      {/* QA Test Workbench with Mobile & Tablet Rigs */}
      <group position={[13.0, 0, 0.5]}>
        <mesh position={[0, 0.72, 0]} castShadow>
          <boxGeometry args={[4.4, 0.08, 1.4]} />
          <meshStandardMaterial color="#064e3b" roughness={0.3} />
        </mesh>
        {[-1.3, 0, 1.3].map((pos, i) => (
          <group key={`qa-screen-${i}`} position={[pos, 1.2, -0.35]}>
            <mesh>
              <boxGeometry args={[0.9, 0.55, 0.03]} />
              <meshStandardMaterial color="#020617" />
            </mesh>
            <mesh position={[0, 0, 0.018]}>
              <planeGeometry args={[0.86, 0.51]} />
              <meshStandardMaterial map={screenTex2} roughness={0.2} />
            </mesh>
          </group>
        ))}
        {/* QA Test Keyboards & Tablets */}
        <mesh position={[-0.8, 0.75, 0.18]}>
          <boxGeometry args={[0.52, 0.02, 0.18]} />
          <meshStandardMaterial color="#020617" emissive="#34d399" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.8, 0.75, 0.18]}>
          <boxGeometry args={[0.52, 0.02, 0.18]} />
          <meshStandardMaterial color="#020617" emissive="#34d399" emissiveIntensity={0.3} />
        </mesh>

        {/* QA Test Chairs facing North towards workbench */}
        <RealisticOfficeChair position={[-0.8, 0, 0.68]} rotationY={Math.PI} />
        <RealisticOfficeChair position={[0.8, 0, 0.68]} rotationY={Math.PI} />
      </group>

      {/* ==================== 7. DEVOPS & SERVER BLADES (HARSHIT & KATHAN) ==================== */}
      <mesh position={[13.0, 0.005, 10.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8.8, 7.5]} />
        <meshStandardMaterial map={devopsCarpetTex} roughness={0.7} />
      </mesh>
      <group position={[13.0, 1.5, 10.5]}>
        <mesh position={[-4.35, 0, 0]}>
          <boxGeometry args={[0.08, 3, 7.5]} />
          <meshPhysicalMaterial color="#fdba74" transparent opacity={0.35} roughness={0.08} transmission={0.75} />
        </mesh>
        <mesh position={[-4.35, 1.52, 0]}>
          <boxGeometry args={[0.12, 0.06, 7.5]} />
          <meshStandardMaterial color="#fb923c" emissive="#ea580c" emissiveIntensity={1.5} />
        </mesh>
        <Html position={[0, 2.7, -3.7]} center distanceFactor={14}>
          <div
            onClick={() => handleZoneClick('DevOps & Cloud Hub')}
            className="cursor-pointer px-3.5 py-1.5 bg-slate-950/90 text-amber-300 border-2 border-amber-400 rounded-xl text-xs font-black tracking-widest shadow-[0_0_15px_rgba(251,146,60,0.5)] backdrop-blur-md whitespace-nowrap hover:scale-105 transition-all font-mono"
          >
            ☁️ DEVOPS HUB • HARSHIT P. & KATHAN
          </div>
        </Html>
      </group>

      {/* 42U Server Racks with Blinking Activity LEDs */}
      <group position={[13.0, 0, 10.5]}>
        {[-1.6, 0, 1.6].map((x, idx) => (
          <group key={`server-${idx}`} position={[x, 1.5, 2.8]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.2, 3.0, 0.95]} />
              <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.8, 0.49]}>
              <planeGeometry args={[0.9, 0.12]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.4} />
            </mesh>
            <mesh position={[0, 0.2, 0.49]}>
              <planeGeometry args={[0.9, 0.12]} />
              <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={1.4} />
            </mesh>
            <mesh position={[0, -0.4, 0.49]}>
              <planeGeometry args={[0.9, 0.12]} />
              <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={1.4} />
            </mesh>
          </group>
        ))}

        {/* Dual DevOps & Automation Workstations (Harshit P. & Kathan) */}
        <RealisticDeveloperDesk position={[-1.5, 0, -1.0]} codeScreen1={screenTex4} codeScreen2={screenTex1} keyboardColor="#fb923c" />
        <RealisticDeveloperDesk position={[1.5, 0, -1.0]} codeScreen1={screenTex1} codeScreen2={screenTex2} keyboardColor="#f59e0b" />
      </group>

      {/* ==================== 8. CENTRAL GLASS CONFERENCE ROOM (WAR ROOM) ==================== */}
      <mesh position={[-13.5, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8.8, 7.5]} />
        <meshStandardMaterial map={confCarpetTex} roughness={0.7} />
      </mesh>
      <group position={[-13.5, 1.5, 0]}>
        {/* Fixed Glass Walls (North & South segments) */}
        <mesh position={[4.35, 0, -2.4]}>
          <boxGeometry args={[0.08, 3.0, 2.7]} />
          <meshPhysicalMaterial color="#f472b6" transparent opacity={0.35} roughness={0.08} transmission={0.75} />
        </mesh>
        <mesh position={[4.35, 0, 2.4]}>
          <boxGeometry args={[0.08, 3.0, 2.7]} />
          <meshPhysicalMaterial color="#f472b6" transparent opacity={0.35} roughness={0.08} transmission={0.75} />
        </mesh>
        {/* Top Header Rail */}
        <mesh position={[4.35, 1.52, 0]}>
          <boxGeometry args={[0.12, 0.06, 7.5]} />
          <meshStandardMaterial color="#db2777" emissive="#f472b6" emissiveIntensity={1.5} />
        </mesh>

        {/* Sliding Double Glass Doors */}
        <group position={[4.35, 0, isConferenceGateOpen ? -2.2 : -0.55]}>
          <mesh>
            <boxGeometry args={[0.06, 2.94, 1.1]} />
            <meshPhysicalMaterial color="#f472b6" transparent opacity={0.4} roughness={0.05} transmission={0.8} />
          </mesh>
          <mesh position={[0.04, 0, 0.4]}>
            <cylinderGeometry args={[0.015, 0.015, 0.8, 12]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.9} />
          </mesh>
        </group>
        <group position={[4.35, 0, isConferenceGateOpen ? 2.2 : 0.55]}>
          <mesh>
            <boxGeometry args={[0.06, 2.94, 1.1]} />
            <meshPhysicalMaterial color="#f472b6" transparent opacity={0.4} roughness={0.05} transmission={0.8} />
          </mesh>
          <mesh position={[0.04, 0, -0.4]}>
            <cylinderGeometry args={[0.015, 0.015, 0.8, 12]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.9} />
          </mesh>
        </group>

        {/* Conference Room Sign & Toggle */}
        <Html position={[4.45, 2.6, 0]} center>
          <div className="flex items-center space-x-1.5">
            <div
              onClick={() => handleZoneClick('War Room')}
              className="cursor-pointer px-2.5 py-1 bg-slate-950/90 text-pink-300 border border-pink-400 rounded-lg text-[10px] font-mono font-bold tracking-wider shadow whitespace-nowrap hover:scale-105 transition"
            >
              📊 CONFERENCE WAR ROOM
            </div>
            <button
              onClick={onToggleConferenceGate}
              className="px-2 py-0.5 bg-slate-900/90 hover:bg-pink-600 border border-pink-400 text-pink-200 text-[9px] font-mono font-bold rounded-lg shadow cursor-pointer transition whitespace-nowrap"
            >
              {isConferenceGateOpen ? '🔓 Open' : '🔒 Closed'}
            </button>
          </div>
        </Html>
      </group>

      {/* Conference Room 8-Seater Walnut Table with Leather Chairs */}
      <group position={[-13.5, 0, 0]}>
        <mesh position={[0, 0.72, 0]} castShadow>
          <boxGeometry args={[4.6, 0.08, 1.8]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.2} metalness={0.1} />
        </mesh>
        {[-1.6, -0.6, 0.6, 1.6].map((cx, i) => (
          <React.Fragment key={`conf-chair-${i}`}>
            <RealisticOfficeChair position={[cx, 0, -1.2]} rotationY={0} />
            <RealisticOfficeChair position={[cx, 0, 1.2]} rotationY={Math.PI} />
          </React.Fragment>
        ))}
        {/* Wall-Mounted Giant Presentation Screen */}
        <mesh position={[-4.3, 2.0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[3.8, 2.0, 0.06]} />
          <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* ==================== 9. RECEPTION LOBBY & COFFEE BAR ==================== */}
      <group position={[0, 0, 13.5]}>
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.2, 4.5]} />
          <meshStandardMaterial color="#0369a1" roughness={0.9} />
        </mesh>
        {/* Curved Reception Counter with White Marble Top */}
        <group position={[5.5, 0, -1.0]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[3.2, 1.2, 1.0]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.7} />
          </mesh>
          <mesh position={[0, 1.22, 0]}>
            <boxGeometry args={[3.3, 0.06, 1.1]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.6, 0.52]}>
            <planeGeometry args={[3.0, 0.08]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.5} />
          </mesh>
          {/* Luminous RECEPTION Desk Badge */}
          <Html position={[0, 0.6, 0.55]} center style={{ pointerEvents: 'none' }}>
            <div className="select-none px-3 py-0.5 rounded-lg bg-slate-950/90 border border-sky-400 text-sky-300 font-mono font-black text-[10px] tracking-widest shadow-[0_0_12px_rgba(56,189,248,0.6)] uppercase whitespace-nowrap">
              🛎️ RECEPTION • POOJA VERMA
            </div>
          </Html>

          {/* Receptionist Desktop PC & iPad Check-In Terminal */}
          <group position={[0, 1.35, 0]}>
            <mesh position={[0, 0.16, 0]}>
              <boxGeometry args={[0.7, 0.42, 0.02]} />
              <meshStandardMaterial color="#020617" roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.16, 0.012]}>
              <planeGeometry args={[0.66, 0.38]} />
              <meshStandardMaterial map={screenTex1} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>
          </group>

          {/* Ergonomic Reception Chair */}
          <RealisticOfficeChair position={[0, 0, -0.65]} rotationY={0} />
        </group>
      </group>

      {/* ==================== 10. EXECUTIVE LOUNGE SOFA (MAX 3) & RESTROOMS ==================== */}
      <ExecutiveLoungeSofa position={[-12.5, 0, 10.5]} />
      <RestroomsPortal position={[-19.8, 0, 14.5]} isOpen={isRestroomGateOpen} onToggle={onToggleRestroomGate} />
    </group>
  );
};
