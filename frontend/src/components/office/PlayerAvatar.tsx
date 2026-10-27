import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { OfficeEmployeeData } from '../../types/office';

interface PlayerAvatarProps {
  isActive: boolean;
  employees: OfficeEmployeeData[];
  onInspectEmployee: (emp: OfficeEmployeeData) => void;
  controlsRef: React.MutableRefObject<any>;
  onActivateWalkMode?: () => void;
  onTalkToEmployee?: (emp: OfficeEmployeeData) => void;
  onToggleGate?: () => void;
  isGateOpen?: boolean;
  isAdityaGateOpen?: boolean;
  onToggleAdityaGate?: () => void;
  isGirirajGateOpen?: boolean;
  onToggleGirirajGate?: () => void;
  isConferenceGateOpen?: boolean;
  onToggleConferenceGate?: () => void;
  isRestroomGateOpen?: boolean;
  onToggleRestroomGate?: () => void;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  isActive,
  employees,
  onInspectEmployee,
  controlsRef,
  onActivateWalkMode,
  onTalkToEmployee,
  onToggleGate,
  isGateOpen = false,
  isAdityaGateOpen = false,
  onToggleAdityaGate,
  isGirirajGateOpen = false,
  onToggleGirirajGate,
  isConferenceGateOpen = false,
  onToggleConferenceGate,
  isRestroomGateOpen = false,
  onToggleRestroomGate
}) => {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  // Position starting right outside South Entrance glass doors
  const playerPos = useRef(new THREE.Vector3(0, 0, 15.2));
  const playerRot = useRef(Math.PI); // Facing inward towards North (cabins)
  const walkPhase = useRef(0);
  const keys = useRef<Record<string, boolean>>({});

  // Proximity states
  const [nearestEmployee, setNearestEmployee] = useState<OfficeEmployeeData | null>(null);
  const [isNearSofa, setIsNearSofa] = useState(false);
  const [isNearRestroom, setIsNearRestroom] = useState(false);
  const [isNearAdityaGate, setIsNearAdityaGate] = useState(false);
  const [isNearGirirajGate, setIsNearGirirajGate] = useState(false);
  const [isNearConfGate, setIsNearConfGate] = useState(false);
  const [isSittingOnSofa, setIsSittingOnSofa] = useState(false);

  // Keyboard listeners for walking & interactions
  useEffect(() => {
    if (!isActive) return;

    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      keys.current[e.key.toLowerCase()] = true;

      // Any movement key stands player up from sofa
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.code) || ['w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        if (isSittingOnSofa) {
          setIsSittingOnSofa(false);
        }
      }

      // 'E' for universal contextual interaction
      if (e.key === 'e' || e.key === 'E') {
        if (isSittingOnSofa) {
          setIsSittingOnSofa(false);
          return;
        }

        if (nearestEmployee) {
          if (onTalkToEmployee) {
            onTalkToEmployee(nearestEmployee);
          } else {
            onInspectEmployee(nearestEmployee);
          }
          return;
        }

        if (isNearSofa) {
          setIsSittingOnSofa(true);
          playerPos.current.set(-12.5, 0.15, 10.55);
          playerRot.current = 0;
          return;
        }

        if (isNearRestroom && onToggleRestroomGate) {
          onToggleRestroomGate();
          return;
        }

        if (isNearAdityaGate && onToggleAdityaGate) {
          onToggleAdityaGate();
          return;
        }

        if (isNearGirirajGate && onToggleGirirajGate) {
          onToggleGirirajGate();
          return;
        }

        if (isNearConfGate && onToggleConferenceGate) {
          onToggleConferenceGate();
          return;
        }
      }

      // 'G' to toggle South entrance gate
      if ((e.key === 'g' || e.key === 'G') && onToggleGate) {
        onToggleGate();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [
    isActive,
    nearestEmployee,
    isNearSofa,
    isNearRestroom,
    isNearAdityaGate,
    isNearGirirajGate,
    isNearConfGate,
    isSittingOnSofa,
    onInspectEmployee,
    onTalkToEmployee,
    onToggleGate,
    onToggleAdityaGate,
    onToggleGirirajGate,
    onToggleConferenceGate,
    onToggleRestroomGate
  ]);

  useFrame((_, delta) => {
    if (!isActive || !groupRef.current) return;
    const dt = Math.min(delta, 0.1);

    // If sitting on sofa
    if (isSittingOnSofa) {
      playerPos.current.set(-12.5, 0.15, 10.55);
      playerRot.current = 0;
      groupRef.current.position.copy(playerPos.current);
      groupRef.current.rotation.y = playerRot.current;

      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = -Math.PI / 2;
        leftLegRef.current.rotation.z = -0.05;
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = -Math.PI / 2;
        rightLegRef.current.rotation.z = 0.05;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -0.6;
        leftArmRef.current.rotation.z = 0.1;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -0.6;
        rightArmRef.current.rotation.z = -0.1;
      }

      // Camera view while relaxing on sofa
      const camOffsetDist = 3.8;
      const camHeight = 1.9;
      const camX = playerPos.current.x - Math.sin(playerRot.current) * camOffsetDist;
      const camZ = playerPos.current.z - Math.cos(playerRot.current) * camOffsetDist;
      camera.position.lerp(new THREE.Vector3(camX, playerPos.current.y + camHeight, camZ), dt * 5);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(new THREE.Vector3(-12.5, 1.2, 13.0), dt * 5);
        controlsRef.current.update();
      }
      return;
    }

    // Movement inputs: W/A/S/D or Arrow keys
    const forward = keys.current['KeyW'] || keys.current['ArrowUp'] || keys.current['w'];
    const backward = keys.current['KeyS'] || keys.current['ArrowDown'] || keys.current['s'];
    const turnLeft = keys.current['KeyA'] || keys.current['ArrowLeft'] || keys.current['a'];
    const turnRight = keys.current['KeyD'] || keys.current['ArrowRight'] || keys.current['d'];

    // Turning
    if (turnLeft) playerRot.current += dt * 3.0;
    if (turnRight) playerRot.current -= dt * 3.0;

    let moveSpeed = 0;
    if (forward) moveSpeed = 4.2;
    if (backward) moveSpeed = -2.8;

    const isMoving = moveSpeed !== 0;

    if (isMoving) {
      // Step in direction player is facing
      const dirX = Math.sin(playerRot.current) * moveSpeed * dt;
      const dirZ = Math.cos(playerRot.current) * moveSpeed * dt;

      playerPos.current.x += dirX;
      playerPos.current.z += dirZ;

      // Clamp within office walls (expand slightly through open gate)
      const maxZ = isGateOpen ? 18.5 : 15.4;
      playerPos.current.x = THREE.MathUtils.clamp(playerPos.current.x, -18.5, 18.5);
      playerPos.current.z = THREE.MathUtils.clamp(playerPos.current.z, -14.8, maxZ);

      // Auto-open main entrance gate when approaching within 2.5m
      if (!isGateOpen && Math.abs(playerPos.current.x) < 2.5 && playerPos.current.z > 13.8 && playerPos.current.z < 16.8) {
        if (onToggleGate) onToggleGate();
      }

      // Walk kinematics
      walkPhase.current += dt * 11;
      const stride = Math.sin(walkPhase.current);
      if (leftLegRef.current) leftLegRef.current.rotation.x = stride * 0.65;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -stride * 0.65;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -stride * 0.55;
      if (rightArmRef.current) rightArmRef.current.rotation.x = stride * 0.55;
    } else {
      // Idle
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
    }

    // Apply transform to avatar mesh
    groupRef.current.position.copy(playerPos.current);
    groupRef.current.rotation.y = playerRot.current;

    // Smooth 3rd-person follow camera
    const camOffsetDist = 3.6;
    const camHeight = 2.4;
    const camX = playerPos.current.x - Math.sin(playerRot.current) * camOffsetDist;
    const camZ = playerPos.current.z - Math.cos(playerRot.current) * camOffsetDist;
    const targetCamPos = new THREE.Vector3(camX, playerPos.current.y + camHeight, camZ);

    camera.position.lerp(targetCamPos, dt * 6);

    const lookTarget = new THREE.Vector3(
      playerPos.current.x + Math.sin(playerRot.current) * 2.0,
      playerPos.current.y + 1.4,
      playerPos.current.z + Math.cos(playerRot.current) * 2.0
    );

    if (controlsRef.current) {
      controlsRef.current.target.lerp(lookTarget, dt * 6);
      controlsRef.current.update();
    }

    // 1. Proximity to all 18 employees
    let closest: OfficeEmployeeData | null = null;
    let minDist = 2.6;

    for (const emp of employees) {
      const [ex, , ez] = emp.current_coords;
      const dist = Math.hypot(playerPos.current.x - ex, playerPos.current.z - ez);
      if (dist < minDist) {
        minDist = dist;
        closest = emp;
      }
    }
    setNearestEmployee(closest);

    // 2. Proximity to Lounge Sofa ([-12.5, 0, 10.5])
    const distSofa = Math.hypot(playerPos.current.x - (-12.5), playerPos.current.z - 10.5);
    setIsNearSofa(distSofa < 2.5);

    // 3. Proximity to Restrooms ([-18.5, 0, 14.5])
    const distRest = Math.hypot(playerPos.current.x - (-18.5), playerPos.current.z - 14.5);
    setIsNearRestroom(distRest < 2.5);

    // 4. Proximity to Aditya's Cabin Gate ([-11.4, 0, -5.65])
    const distAditya = Math.hypot(playerPos.current.x - (-11.4), playerPos.current.z - (-5.65));
    setIsNearAdityaGate(distAditya < 2.5);

    // 5. Proximity to Giriraj's Cabin Gate ([10.9, 0, -5.65])
    const distGiriraj = Math.hypot(playerPos.current.x - 10.9, playerPos.current.z - (-5.65));
    setIsNearGirirajGate(distGiriraj < 2.5);

    // 6. Proximity to Conference Room Doors ([-9.15, 0, 0])
    const distConf = Math.hypot(playerPos.current.x - (-9.15), playerPos.current.z - 0);
    setIsNearConfGate(distConf < 2.5);
  });

  return (
    <group
      ref={groupRef}
      position={[0, 0, 15.2]}
      rotation={[0, Math.PI, 0]}
      onClick={(e) => {
        e.stopPropagation();
        if (!isActive && onActivateWalkMode) {
          onActivateWalkMode();
        }
      }}
    >
      {/* Chotu Kumar Owner Identification Badge (Crisp Readable 11px) */}
      <Html position={[0, 1.95, 0]} center style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center select-none font-sans">
          <div className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider border border-yellow-200 shadow-md flex items-center space-x-1.5 whitespace-nowrap">
            <span>👑</span>
            <span>CHOTU KUMAR (OWNER)</span>
          </div>
        </div>
      </Html>

      {/* Dynamic Contextual Interaction Prompt */}
      {isActive && (
        <Html position={[0, 2.3, 0]} center style={{ pointerEvents: 'auto' }}>
          {isSittingOnSofa ? (
            <button
              onClick={() => setIsSittingOnSofa(false)}
              className="cursor-pointer bg-slate-950/95 border-2 border-amber-400 text-amber-300 hover:text-white hover:bg-amber-600 px-3 py-1 rounded-xl text-[11px] font-mono font-bold shadow-[0_0_15px_#f59e0b] whitespace-nowrap animate-bounce flex items-center space-x-1.5 transition active:scale-95"
            >
              <span className="bg-amber-400 text-black px-1.5 py-0.2 rounded text-[9px] font-black">E</span>
              <span>🛋️ Stand Up from Sofa (W/A/S/D)</span>
            </button>
          ) : nearestEmployee ? (
            <button
              onClick={() => {
                if (onTalkToEmployee) onTalkToEmployee(nearestEmployee);
              }}
              className="cursor-pointer bg-slate-950/95 border-2 border-sky-400 text-sky-300 hover:text-white hover:bg-sky-600 px-3 py-1 rounded-xl text-[11px] font-mono font-bold shadow-[0_0_15px_#38bdf8] whitespace-nowrap animate-bounce flex items-center space-x-1.5 transition active:scale-95"
            >
              <span className="bg-sky-400 text-black px-1.5 py-0.2 rounded text-[9px] font-black">E</span>
              <span>💬 Talk: {nearestEmployee.name}</span>
            </button>
          ) : isNearSofa ? (
            <button
              onClick={() => {
                setIsSittingOnSofa(true);
                playerPos.current.set(-12.5, 0.15, 10.55);
                playerRot.current = 0;
              }}
              className="cursor-pointer bg-slate-950/95 border-2 border-amber-400 text-amber-300 hover:text-white hover:bg-amber-600 px-3 py-1 rounded-xl text-[11px] font-mono font-bold shadow-[0_0_15px_#f59e0b] whitespace-nowrap animate-bounce flex items-center space-x-1.5 transition active:scale-95"
            >
              <span className="bg-amber-400 text-black px-1.5 py-0.2 rounded text-[9px] font-black">E</span>
              <span>🛋️ Sit on Lounge Sofa</span>
            </button>
          ) : isNearRestroom ? (
            <button
              onClick={onToggleRestroomGate}
              className="cursor-pointer bg-slate-950/95 border-2 border-cyan-400 text-cyan-300 hover:text-white hover:bg-cyan-600 px-3 py-1 rounded-xl text-[11px] font-mono font-bold shadow-[0_0_15px_#06b6d4] whitespace-nowrap animate-bounce flex items-center space-x-1.5 transition active:scale-95"
            >
              <span className="bg-cyan-400 text-black px-1.5 py-0.2 rounded text-[9px] font-black">E</span>
              <span>🚻 {isRestroomGateOpen ? 'Close Restrooms Door' : 'Open Restrooms Door'}</span>
            </button>
          ) : isNearAdityaGate ? (
            <button
              onClick={onToggleAdityaGate}
              className="cursor-pointer bg-slate-950/95 border-2 border-sky-400 text-sky-300 hover:text-white hover:bg-sky-600 px-3 py-1 rounded-xl text-[11px] font-mono font-bold shadow-[0_0_15px_#38bdf8] whitespace-nowrap animate-bounce flex items-center space-x-1.5 transition active:scale-95"
            >
              <span className="bg-sky-400 text-black px-1.5 py-0.2 rounded text-[9px] font-black">E</span>
              <span>🚪 {isAdityaGateOpen ? "Close Aditya's Gate" : "Open Aditya's Gate"}</span>
            </button>
          ) : isNearGirirajGate ? (
            <button
              onClick={onToggleGirirajGate}
              className="cursor-pointer bg-slate-950/95 border-2 border-purple-400 text-purple-300 hover:text-white hover:bg-purple-600 px-3 py-1 rounded-xl text-[11px] font-mono font-bold shadow-[0_0_15px_#c084fc] whitespace-nowrap animate-bounce flex items-center space-x-1.5 transition active:scale-95"
            >
              <span className="bg-purple-400 text-black px-1.5 py-0.2 rounded text-[9px] font-black">E</span>
              <span>🚪 {isGirirajGateOpen ? "Close Giriraj's Gate" : "Open Giriraj's Gate"}</span>
            </button>
          ) : isNearConfGate ? (
            <button
              onClick={onToggleConferenceGate}
              className="cursor-pointer bg-slate-950/95 border-2 border-pink-400 text-pink-300 hover:text-white hover:bg-pink-600 px-3 py-1 rounded-xl text-[11px] font-mono font-bold shadow-[0_0_15px_#f472b6] whitespace-nowrap animate-bounce flex items-center space-x-1.5 transition active:scale-95"
            >
              <span className="bg-pink-400 text-black px-1.5 py-0.2 rounded text-[9px] font-black">E</span>
              <span>🚪 {isConferenceGateOpen ? 'Close War Room' : 'Open War Room'}</span>
            </button>
          ) : null}
        </Html>
      )}

      {/* Enter & Walk Prompt when not yet in Walk Mode */}
      {!isActive && (
        <Html position={[0, 2.4, 0]} center distanceFactor={12}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onActivateWalkMode) onActivateWalkMode();
            }}
            className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-2 border-emerald-300 px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.7)] whitespace-nowrap animate-pulse hover:scale-110 transition-all font-mono"
          >
            🎮 ENTER & WALK INTO OFFICE (W/A/S/D)
          </button>
        </Html>
      )}

      {/* Distinct Ground Ring for Playable Character */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.55, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.8} />
      </mesh>

      {/* Player Avatar Mesh (Distinct Cyber Inspector Suit) */}
      <group position={[0, 0, 0]}>
        {/* Legs */}
        <group ref={leftLegRef} position={[-0.14, 0.75, 0]}>
          <mesh position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.07, 0.32, 8, 12]} />
            <meshStandardMaterial color="#0284c7" roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.42, 0.04]}>
            <boxGeometry args={[0.11, 0.08, 0.2]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
        </group>

        <group ref={rightLegRef} position={[0.14, 0.75, 0]}>
          <mesh position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.07, 0.32, 8, 12]} />
            <meshStandardMaterial color="#0284c7" roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.42, 0.04]}>
            <boxGeometry args={[0.11, 0.08, 0.2]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
        </group>

        {/* Torso & Inspector Trench/Vest */}
        <group position={[0, 0.85, 0]}>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.42, 0.48, 0.24]} />
            <meshStandardMaterial color="#0369a1" metalness={0.4} roughness={0.4} />
          </mesh>
          {/* Neon Spine Indicator */}
          <mesh position={[0, 0.3, -0.13]}>
            <planeGeometry args={[0.06, 0.4]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.5} />
          </mesh>

          {/* Arms */}
          <group ref={leftArmRef} position={[-0.26, 0.48, 0]}>
            <mesh position={[0, -0.22, 0]}>
              <capsuleGeometry args={[0.06, 0.3, 8, 12]} />
              <meshStandardMaterial color="#0369a1" />
            </mesh>
          </group>

          <group ref={rightArmRef} position={[0.26, 0.48, 0]}>
            <mesh position={[0, -0.22, 0]}>
              <capsuleGeometry args={[0.06, 0.3, 8, 12]} />
              <meshStandardMaterial color="#0369a1" />
            </mesh>
          </group>

          {/* Head & Inspector Visor */}
          <group position={[0, 0.55, 0]}>
            <mesh position={[0, 0.16, 0]}>
              <sphereGeometry args={[0.16, 16, 16]} />
              <meshStandardMaterial color="#f5d0b5" />
            </mesh>
            {/* Holographic Glowing Visor */}
            <mesh position={[0, 0.16, 0.13]}>
              <boxGeometry args={[0.2, 0.06, 0.06]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.5} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
