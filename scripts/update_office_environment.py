with open('frontend/src/components/office/OfficeEnvironment.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update interface
target1 = '''interface OfficeEnvironmentProps {
  onSelectZone?: (zoneName: string) => void;
}'''
replacement1 = '''interface OfficeEnvironmentProps {
  onSelectZone?: (zoneName: string) => void;
  isGateOpen?: boolean;
  onToggleGate?: () => void;
}'''
text = text.replace(target1, replacement1, 1)

# 2. Update component signature
target2 = 'export const OfficeEnvironment: React.FC<OfficeEnvironmentProps> = ({ onSelectZone }) => {'
replacement2 = 'export const OfficeEnvironment: React.FC<OfficeEnvironmentProps> = ({ onSelectZone, isGateOpen = false, onToggleGate }) => {'
text = text.replace(target2, replacement2, 1)

# 3. Update South entrance sliding doors
target3 = '''        {/* Double Sliding Glass Doors */}
        <mesh position={[-1.0, -0.5, 0]}>
          <boxGeometry args={[1.9, 3.0, 0.06]} />
          <meshPhysicalMaterial color="#93c5fd" transparent opacity={0.35} roughness={0.05} transmission={0.8} />
        </mesh>
        <mesh position={[-0.15, -0.5, 0.05]}>
          <cylinderGeometry args={[0.02, 0.02, 1.2, 12]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.1} />
        </mesh>

        <mesh position={[1.0, -0.5, 0]}>
          <boxGeometry args={[1.9, 3.0, 0.06]} />
          <meshPhysicalMaterial color="#93c5fd" transparent opacity={0.35} roughness={0.05} transmission={0.8} />
        </mesh>
        <mesh position={[0.15, -0.5, 0.05]}>
          <cylinderGeometry args={[0.02, 0.02, 1.2, 12]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.1} />
        </mesh>

        <Html position={[0, 1.2, -0.15]} center distanceFactor={14}>
          <div className="px-4 py-1.5 bg-slate-950/95 border-2 border-sky-400 rounded-xl text-sky-300 font-mono font-black text-xs tracking-[0.2em] shadow-[0_0_20px_#38bdf8] whitespace-nowrap">
            🚪 ENTRANCE • SWARM ENGINEERING HQ
          </div>
        </Html>'''

replacement3 = '''        {/* Double Sliding Glass Doors (Animated / Openable) */}
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

        <Html position={[0, 1.25, -0.15]} center distanceFactor={24}>
          <div className="flex flex-col items-center gap-1.5 pointer-events-auto select-none">
            <div className="px-3 py-1 bg-slate-950/95 border border-sky-400 rounded-xl text-sky-300 font-mono font-bold text-[10px] tracking-wider shadow-[0_0_15px_#38bdf8] whitespace-nowrap">
              🚪 SWARM HQ ENTRANCE
            </div>
            {onToggleGate && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleGate();
                }}
                className={`cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-mono font-black border transition active:scale-95 shadow-xl ${
                  isGateOpen
                    ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-300 shadow-rose-500/50'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-300 shadow-emerald-500/50 animate-pulse'
                }`}
              >
                {isGateOpen ? '🔒 CLOSE GATE [G]' : '🔓 OPEN GATE [G]'}
              </button>
            )}
          </div>
        </Html>'''
text = text.replace(target3, replacement3, 1)

# 4. Add Reception Terminal & Chair on the Reception Counter
target4 = '''          <mesh position={[0, 0.6, 0.52]}>
            <planeGeometry args={[3.0, 0.08]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.5} />
          </mesh>
        </group>
      </group>'''

replacement4 = '''          <mesh position={[0, 0.6, 0.52]}>
            <planeGeometry args={[3.0, 0.08]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.5} />
          </mesh>

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
      </group>'''
text = text.replace(target4, replacement4, 1)

with open('frontend/src/components/office/OfficeEnvironment.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)
print('Updated OfficeEnvironment.tsx successfully')
