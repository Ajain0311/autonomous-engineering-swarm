import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { OfficeEmployeeData, SpeechBubbleItem } from '../../types/office';
import { gameAudio } from '../../utils/gameAudio';

interface HumanoidCharacterProps {
  employee: OfficeEmployeeData;
  speech: SpeechBubbleItem | null;
  isSelected: boolean;
  onSelect: (emp: OfficeEmployeeData) => void;
  speedMultiplier: number;
  isOwnerNearby?: boolean;
}

export const HumanoidCharacter: React.FC<HumanoidCharacterProps> = ({
  employee,
  speech,
  isSelected,
  onSelect,
  speedMultiplier,
  isOwnerNearby = false
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const targetingRingRef = useRef<THREE.Mesh>(null);

  // Position and walking state
  const currentPos = useRef(new THREE.Vector3(...employee.current_coords));
  const walkPhase = useRef(0);

  const { appearance, action, target_coords } = employee;

  // Derive RPG Level from tasks completed
  const rpgLevel = Math.min(99, 5 + (employee.tasks_completed || 0) * 3);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.1) * speedMultiplier;

    // Rotate targeting reticle if selected
    if (targetingRingRef.current) {
      targetingRingRef.current.rotation.z += delta * 1.5;
    }

    // Movement interpolation towards target
    if (target_coords) {
      const targetVec = new THREE.Vector3(...target_coords);
      const dist = currentPos.current.distanceTo(targetVec);

      if (dist > 0.1) {
        // Compute direction and rotate
        const dir = targetVec.clone().sub(currentPos.current).normalize();
        const moveStep = Math.min(dist, dt * 3.4);
        currentPos.current.add(dir.multiplyScalar(moveStep));

        const targetRotY = Math.atan2(dir.x, dir.z);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          targetRotY,
          dt * 10
        );

        // Walking kinematics
        walkPhase.current += dt * 10;
        const stride = Math.sin(walkPhase.current);
        const bob = Math.abs(Math.sin(walkPhase.current)) * 0.05;

        groupRef.current.position.set(currentPos.current.x, currentPos.current.y + bob, currentPos.current.z);

        if (leftLegRef.current) leftLegRef.current.rotation.x = stride * 0.6;
        if (rightLegRef.current) rightLegRef.current.rotation.x = -stride * 0.6;
        if (leftArmRef.current) leftArmRef.current.rotation.x = -stride * 0.5;
        if (rightArmRef.current) rightArmRef.current.rotation.x = stride * 0.5;

        return;
      }
    }

    // Default positioning when stationary
    groupRef.current.position.copy(currentPos.current);

    // Action-specific kinematics
    const isBhupendra = employee.id === 'agent-bhupendra' || employee.name.includes('Bhupendra');

    // SPECIAL ANIMATION: When Owner Baburao is nearby, Bhupendra leaves chair and lies down flat on the desk/table sleeping like true bakchod!
    if (isBhupendra && isOwnerNearby) {
      // If facing 0 (seated south), table is at z + 0.6. If facing PI (north), table is at z - 0.6.
      const tableZOffset = employee.rotation_y === 0 ? 0.6 : -0.6;
      groupRef.current.position.set(currentPos.current.x, 0.78, currentPos.current.z + tableZOffset);
      groupRef.current.rotation.set(-Math.PI / 2, 0, Math.PI / 2);

      // Relaxed straight legs while sleeping on desk
      if (leftLegRef.current) {
        leftLegRef.current.rotation.set(0, 0, 0.05);
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.set(0, 0, -0.05);
      }
      // Sleeping arms folded under head or rested on chest
      if (leftArmRef.current) {
        leftArmRef.current.rotation.set(-1.2, 0, 0.4);
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.set(-1.2, 0, -0.4);
      }
      if (headRef.current) {
        headRef.current.rotation.set(0, 0, 0.3); // Tilted sleeping head
      }
      return;
    }

    if (action === 'SIT' || action === 'CODE') {
      // Sitting posture
      groupRef.current.position.y = currentPos.current.y - 0.22;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, employee.rotation_y, dt * 6);

      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = -Math.PI / 2;
        leftLegRef.current.rotation.z = -0.05;
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = -Math.PI / 2;
        rightLegRef.current.rotation.z = 0.05;
      }

      if (action === 'CODE') {
        // Typing animation: rapid hand movement + monitor glance
        const typeOsc = Math.sin(Date.now() * 0.015);
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -1.2 + typeOsc * 0.1;
          leftArmRef.current.rotation.z = 0.25;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -1.2 - typeOsc * 0.1;
          rightArmRef.current.rotation.z = -0.25;
        }
        if (headRef.current) {
          headRef.current.rotation.x = 0.2 + Math.sin(Date.now() * 0.003) * 0.05;
        }
      } else {
        // Sitting relaxed
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -0.7;
          leftArmRef.current.rotation.z = 0.1;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -0.7;
          rightArmRef.current.rotation.z = -0.1;
        }
        if (headRef.current) headRef.current.rotation.x = 0;
      }
      return;
    }

    // Standing / Idle / Presenting / Talking posture
    groupRef.current.position.y = currentPos.current.y;
    if (leftLegRef.current) {
      leftLegRef.current.rotation.x = 0;
      leftLegRef.current.rotation.z = 0;
    }
    if (rightLegRef.current) {
      rightLegRef.current.rotation.x = 0;
      rightLegRef.current.rotation.z = 0;
    }

    if (action === 'PRESENT') {
      // Standing and presenting with raised arm pointing
      const sway = Math.sin(Date.now() * 0.004) * 0.1;
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.5;
        rightArmRef.current.rotation.z = -0.5 + sway;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -0.4;
        leftArmRef.current.rotation.z = 0.2;
      }
      if (headRef.current) headRef.current.rotation.y = sway;
    } else if (action === 'TALK') {
      // Gesturing with both arms while speaking
      const talkOsc = Math.sin(Date.now() * 0.008);
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -0.8 + talkOsc * 0.2;
        leftArmRef.current.rotation.z = 0.3;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -0.8 - talkOsc * 0.2;
        rightArmRef.current.rotation.z = -0.3;
      }
      if (headRef.current) {
        headRef.current.rotation.y = talkOsc * 0.15;
        headRef.current.rotation.x = Math.abs(talkOsc) * 0.08;
      }
    } else {
      // Natural idle breathing
      const breathe = Math.sin(Date.now() * 0.003) * 0.03;
      if (torsoRef.current) torsoRef.current.position.y = 0.85 + breathe;
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = 0.05 + breathe;
        leftArmRef.current.rotation.z = 0.08;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = 0.05 + breathe;
        rightArmRef.current.rotation.z = -0.08;
      }
      if (headRef.current) headRef.current.rotation.set(0, 0, 0);
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        gameAudio.playSelect();
        onSelect(employee);
      }}
    >
      {/* Sci-Fi Hologram Targeting Reticle on Floor */}
      {isSelected && (
        <group position={[0, 0.03, 0]}>
          {/* Rotating Outer Dashed Reticle */}
          <mesh ref={targetingRingRef} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.65, 0.78, 32]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
          {/* Inner Glowing Core */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.55, 32]} />
            <meshBasicMaterial color="#0284c7" transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>
          {/* Hologram Light Pillar */}
          <mesh position={[0, 1.0, 0]}>
            <cylinderGeometry args={[0.65, 0.65, 2.0, 32, 1, true]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.08} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* Ultra-Minimal Micro Nameplate (Fixed Pixel Size - Never Scales Up) */}
      <Html position={[0, 1.88, 0]} center style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center select-none font-sans">
          <div
            className={`px-1.5 py-0.5 rounded-md text-[8px] font-bold shadow border backdrop-blur-md flex items-center space-x-1 whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-sky-600 text-white border-sky-300 shadow-sky-500/50 scale-105'
                : 'bg-slate-950/85 text-slate-200 border-slate-700/80'
            }`}
          >
            <span
              className={`w-1 h-1 rounded-full ${
                action === 'CODE'
                  ? 'bg-emerald-400'
                  : action === 'TEST'
                  ? 'bg-cyan-400'
                  : action === 'DEFECT'
                  ? 'bg-rose-500 animate-ping'
                  : 'bg-sky-400'
              }`}
            />
            <span className="tracking-tight">{employee.name}</span>
          </div>

          {isSelected && (
            <span className="text-[7px] font-medium text-slate-300 bg-slate-900/90 px-1 py-0.2 rounded mt-0.5 uppercase border border-slate-700/60 whitespace-nowrap">
              {employee.role.split('/')[0].trim()}
            </span>
          )}
        </div>
      </Html>

      {/* Live RPG Game Dialogue Bubble */}
      {speech && (
        <Html position={[0, 2.85, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
          <div className="relative max-w-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border-2 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.35)] rounded-2xl p-3.5 text-xs backdrop-blur-xl font-sans">
              <div className="flex items-center space-x-2 pb-1.5 border-b border-sky-500/30 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
                <span className="font-extrabold text-sky-300 text-xs tracking-wide">{employee.name}</span>
                <span className="text-[10px] text-amber-300 ml-auto font-mono bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/40 font-bold uppercase">
                  {action}
                </span>
              </div>
              <p className="font-medium text-slate-100 text-xs leading-relaxed italic">
                "{speech.text}"
              </p>
            </div>
            {/* Sci-Fi Dialogue Tail */}
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-sky-400 mx-auto" />
          </div>
        </Html>
      )}

      {/* Human Body 3D Geometry */}
      <group position={[0, 0, 0]}>
        {/* Legs: Left & Right */}
        <group ref={leftLegRef} position={[-0.14, 0.75, 0]}>
          <mesh position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.07, 0.32, 8, 12]} />
            <meshStandardMaterial color={appearance.pantsColor} roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.42, 0.04]}>
            <boxGeometry args={[0.11, 0.08, 0.2]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
        </group>

        <group ref={rightLegRef} position={[0.14, 0.75, 0]}>
          <mesh position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.07, 0.32, 8, 12]} />
            <meshStandardMaterial color={appearance.pantsColor} roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.42, 0.04]}>
            <boxGeometry args={[0.11, 0.08, 0.2]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
        </group>

        {/* Torso & Upper Body */}
        <group ref={torsoRef} position={[0, 0.85, 0]}>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.42, 0.48, 0.24]} />
            <meshStandardMaterial color={appearance.clothingColor} roughness={0.6} />
          </mesh>

          {/* Blazer Collar if applicable */}
          {appearance.clothingStyle === 'blazer' && (
            <mesh position={[0, 0.42, 0.12]}>
              <boxGeometry args={[0.26, 0.2, 0.04]} />
              <meshStandardMaterial color="#0f172a" roughness={0.5} />
            </mesh>
          )}

          {/* Lanyard with glowing keycard */}
          <group position={[0, 0.26, 0.13]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.08, 0.12, 0.01]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.2} emissive="#0284c7" emissiveIntensity={0.6} />
            </mesh>
          </group>

          {/* Arms: Left & Right */}
          <group ref={leftArmRef} position={[-0.26, 0.48, 0]}>
            <mesh position={[0, -0.22, 0]}>
              <capsuleGeometry args={[0.06, 0.3, 8, 12]} />
              <meshStandardMaterial color={appearance.clothingColor} roughness={0.6} />
            </mesh>
            <mesh position={[0, -0.42, 0]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial color={appearance.skinTone} roughness={0.8} />
            </mesh>
          </group>

          <group ref={rightArmRef} position={[0.26, 0.48, 0]}>
            <mesh position={[0, -0.22, 0]}>
              <capsuleGeometry args={[0.06, 0.3, 8, 12]} />
              <meshStandardMaterial color={appearance.clothingColor} roughness={0.6} />
            </mesh>
            <mesh position={[0, -0.42, 0]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial color={appearance.skinTone} roughness={0.8} />
            </mesh>
            {/* Tech Watch with neon screen */}
            {appearance.accessory === 'watch' && (
              <mesh position={[0, -0.36, 0]}>
                <torusGeometry args={[0.065, 0.015, 8, 16]} />
                <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
              </mesh>
            )}
          </group>

          {/* Head & Neck */}
          <group ref={headRef} position={[0, 0.55, 0]}>
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.05, 0.06, 0.08, 12]} />
              <meshStandardMaterial color={appearance.skinTone} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.16, 0]}>
              <sphereGeometry args={[0.16, 20, 20]} />
              <meshStandardMaterial color={appearance.skinTone} roughness={0.8} />
            </mesh>

            {/* Stylized Hair */}
            <mesh position={[0, 0.18, -0.02]}>
              <sphereGeometry args={[0.165, 16, 16]} />
              <meshStandardMaterial color={appearance.hairColor} roughness={0.8} />
            </mesh>
            {appearance.hairStyle === 'parted' && (
              <mesh position={[0.02, 0.24, 0.04]}>
                <boxGeometry args={[0.22, 0.06, 0.18]} />
                <meshStandardMaterial color={appearance.hairColor} roughness={0.8} />
              </mesh>
            )}
            {appearance.hairStyle === 'ponytail' && (
              <mesh position={[0, 0.16, -0.2]}>
                <cylinderGeometry args={[0.04, 0.06, 0.22, 8]} />
                <meshStandardMaterial color={appearance.hairColor} roughness={0.8} />
              </mesh>
            )}

            {/* Glasses if applicable */}
            {appearance.hasGlasses && (
              <group position={[0, 0.13, 0.14]}>
                <mesh position={[-0.055, 0, 0]}>
                  <ringGeometry args={[0.025, 0.038, 16]} />
                  <meshBasicMaterial color="#0f172a" side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0.055, 0, 0]}>
                  <ringGeometry args={[0.025, 0.038, 16]} />
                  <meshBasicMaterial color="#0f172a" side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.04, 0.008, 0.01]} />
                  <meshBasicMaterial color="#0f172a" />
                </mesh>
              </group>
            )}
          </group>
        </group>
      </group>
    </group>
  );
};
