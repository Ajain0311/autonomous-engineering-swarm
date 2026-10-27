import re

# ==============================================================================
# 1. UPDATE OfficeEnvironment.tsx
# ==============================================================================
with open('frontend/src/components/office/OfficeEnvironment.tsx', 'r', encoding='utf-8') as f:
    oe = f.read()

# Add door props to OfficeEnvironmentProps
old_props = '''interface OfficeEnvironmentProps {
  onSelectZone: (zone: string) => void;
  isGateOpen?: boolean;
  onToggleGate?: () => void;
}'''

new_props = '''interface OfficeEnvironmentProps {
  onSelectZone: (zone: string) => void;
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
}'''
oe = oe.replace(old_props, new_props)

# Update destructuring in OfficeEnvironment
old_destruct = 'export const OfficeEnvironment: React.FC<OfficeEnvironmentProps> = ({ onSelectZone, isGateOpen = false, onToggleGate }) => {'
new_destruct = '''export const OfficeEnvironment: React.FC<OfficeEnvironmentProps> = ({
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
}) => {'''
oe = oe.replace(old_destruct, new_destruct)

# Update RestroomsPortal to support open/close
old_restrooms = '''// Modern Restrooms Portal with Signage
const RestroomsPortal: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 1.6, 0]}>
      <boxGeometry args={[0.1, 3.2, 1.6]} />
      <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.3} />
    </mesh>
    <mesh position={[0.02, 1.5, 0]}>
      <boxGeometry args={[0.04, 3.0, 1.4]} />
      <meshStandardMaterial color="#0f172a" roughness={0.7} />
    </mesh>
    <mesh position={[0.06, 1.4, 0.55]}>
      <cylinderGeometry args={[0.015, 0.015, 0.6, 12]} />
      <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.1} />
    </mesh>
    <Html position={[0.06, 2.7, 0]} center style={{ pointerEvents: 'none' }}>
      <div className="px-2 py-0.5 bg-slate-950/90 border border-sky-400 text-sky-300 text-[8px] font-mono font-black rounded-md shadow-[0_0_12px_#38bdf8] flex items-center space-x-1 whitespace-nowrap">
        <span>🚻</span>
        <span>RESTROOMS</span>
      </div>
    </Html>
  </group>
);'''

new_restrooms = '''// Modern Restrooms Portal with Animated Interactive Door
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
);'''
oe = oe.replace(old_restrooms, new_restrooms)

# Update Aditya's Cabin partition with Sliding Glass Door
aditya_cabin_old = '''        {/* Glass Partition with Aluminum Header & Base Tracks */}
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
      </group>'''

aditya_cabin_new = '''        {/* Glass Partition with Animated Sliding Cabin Door */}
      <group position={[-13.5, 1.5, -9.5]}>
        {/* Fixed Left Glass Wall */}
        <mesh position={[-2.1, 0, 3.85]}>
          <boxGeometry args={[4.4, 3, 0.08]} />
          <meshPhysicalMaterial color="#93c5fd" transparent opacity={0.35} roughness={0.08} transmission={0.75} />
        </mesh>
        {/* Top Header Track */}
        <mesh position={[0, 1.52, 3.85]}>
          <boxGeometry args={[8.6, 0.08, 0.14]} />
          <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={1.2} />
        </mesh>
        {/* East Glass Wall */}
        <mesh position={[4.35, 0, 0]}>
          <boxGeometry args={[0.08, 3, 7.7]} />
          <meshPhysicalMaterial color="#93c5fd" transparent opacity={0.35} roughness={0.08} transmission={0.75} />
        </mesh>
        <mesh position={[4.35, 1.52, 0]}>
          <boxGeometry args={[0.12, 0.06, 7.7]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.5} />
        </mesh>

        {/* Sliding Executive Glass Door */}
        <group position={[isAdityaGateOpen ? 3.9 : 2.1, 0, 3.85]}>
          <mesh>
            <boxGeometry args={[4.0, 2.94, 0.06]} />
            <meshPhysicalMaterial color="#38bdf8" transparent opacity={0.42} roughness={0.05} transmission={0.8} />
          </mesh>
          {/* Executive Chrome Handle */}
          <mesh position={[-1.7, 0, 0.05]}>
            <cylinderGeometry args={[0.02, 0.02, 1.0, 16]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>

        {/* Zone Badge & Door Button */}
        <Html position={[0, 2.7, 3.9]} center>
          <div className="flex items-center space-x-1.5">
            <div
              onClick={() => handleZoneClick('Executive Cabin')}
              className="cursor-pointer px-3 py-1 bg-slate-950/90 text-sky-300 border-2 border-sky-400 rounded-xl text-[11px] font-black tracking-widest shadow-[0_0_15px_rgba(56,189,248,0.5)] backdrop-blur-md whitespace-nowrap hover:scale-105 transition font-mono"
            >
              👑 EXECUTIVE CABIN • ADITYA JAIN
            </div>
            <button
              onClick={onToggleAdityaGate}
              className="px-2 py-1 bg-slate-900/90 hover:bg-sky-600 border border-sky-400 text-sky-200 text-[10px] font-mono font-bold rounded-xl shadow cursor-pointer transition whitespace-nowrap"
            >
              {isAdityaGateOpen ? '🔓 Gate Open' : '🔒 Gate Closed'}
            </button>
          </div>
        </Html>
      </group>'''
oe = oe.replace(aditya_cabin_old, aditya_cabin_new)

# Update Giriraj's Cabin partition with Sliding Glass Door
giriraj_cabin_old = '''      <group position={[13.0, 1.5, -9.5]}>
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
            onClick={() => handleZoneClick('Senior Lead Cabin')}
            className="cursor-pointer px-3.5 py-1.5 bg-slate-950/90 text-purple-300 border-2 border-purple-400 rounded-xl text-xs font-black tracking-widest shadow-[0_0_15px_rgba(192,132,252,0.5)] backdrop-blur-md whitespace-nowrap hover:scale-105 transition-all font-mono"
          >
            ⚡ ENGINEERING LEAD • GIRIRAJ MALI
          </div>
        </Html>
      </group>'''

giriraj_cabin_new = '''      <group position={[13.0, 1.5, -9.5]}>
        {/* Fixed Right Glass Wall */}
        <mesh position={[2.1, 0, 3.85]}>
          <boxGeometry args={[4.4, 3, 0.08]} />
          <meshPhysicalMaterial color="#c4b5fd" transparent opacity={0.35} roughness={0.08} transmission={0.75} />
        </mesh>
        {/* Top Header Track */}
        <mesh position={[0, 1.52, 3.85]}>
          <boxGeometry args={[8.6, 0.08, 0.14]} />
          <meshStandardMaterial color="#9333ea" emissive="#c084fc" emissiveIntensity={1.2} />
        </mesh>
        {/* West Glass Wall */}
        <mesh position={[-4.35, 0, 0]}>
          <boxGeometry args={[0.08, 3, 7.7]} />
          <meshPhysicalMaterial color="#c4b5fd" transparent opacity={0.35} roughness={0.08} transmission={0.75} />
        </mesh>
        <mesh position={[-4.35, 1.52, 0]}>
          <boxGeometry args={[0.12, 0.06, 7.7]} />
          <meshStandardMaterial color="#c084fc" emissive="#9333ea" emissiveIntensity={1.5} />
        </mesh>

        {/* Sliding Lead Glass Door */}
        <group position={[isGirirajGateOpen ? -3.9 : -2.1, 0, 3.85]}>
          <mesh>
            <boxGeometry args={[4.0, 2.94, 0.06]} />
            <meshPhysicalMaterial color="#c084fc" transparent opacity={0.42} roughness={0.05} transmission={0.8} />
          </mesh>
          {/* Chrome Handle */}
          <mesh position={[1.7, 0, 0.05]}>
            <cylinderGeometry args={[0.02, 0.02, 1.0, 16]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>

        {/* Zone Badge & Door Button */}
        <Html position={[0, 2.7, 3.9]} center>
          <div className="flex items-center space-x-1.5">
            <div
              onClick={() => handleZoneClick('Senior Lead Cabin')}
              className="cursor-pointer px-3 py-1 bg-slate-950/90 text-purple-300 border-2 border-purple-400 rounded-xl text-[11px] font-black tracking-widest shadow-[0_0_15px_rgba(192,132,252,0.5)] backdrop-blur-md whitespace-nowrap hover:scale-105 transition font-mono"
            >
              ⚡ ENGINEERING LEAD • GIRIRAJ MALI
            </div>
            <button
              onClick={onToggleGirirajGate}
              className="px-2 py-1 bg-slate-900/90 hover:bg-purple-600 border border-purple-400 text-purple-200 text-[10px] font-mono font-bold rounded-xl shadow cursor-pointer transition whitespace-nowrap"
            >
              {isGirirajGateOpen ? '🔓 Gate Open' : '🔒 Gate Closed'}
            </button>
          </div>
        </Html>
      </group>'''
oe = oe.replace(giriraj_cabin_old, giriraj_cabin_new)

# Update Central Glass Conference Room with sliding doors
conf_room_old = '''      <group position={[-13.5, 1.5, 0]}>
        <mesh position={[4.35, 0, 0]}>
          <boxGeometry args={[0.08, 3.0, 7.5]} />
          <meshPhysicalMaterial color="#f472b6" transparent opacity={0.35} roughness={0.08} transmission={0.75} />
        </mesh>
        <mesh position={[4.35, 1.52, 0]}>
          <boxGeometry args={[0.12, 0.06, 7.5]} />
          <meshStandardMaterial color="#f472b6" emissive="#db2777" emissiveIntensity={1.5} />
        </mesh>
      </group>'''

conf_room_new = '''      <group position={[-13.5, 1.5, 0]}>
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
      </group>'''
oe = oe.replace(conf_room_old, conf_room_new)

# Update RestroomsPortal call at the bottom
oe = oe.replace(
    '<RestroomsPortal position={[-19.8, 0, 14.5]} />',
    '<RestroomsPortal position={[-19.8, 0, 14.5]} isOpen={isRestroomGateOpen} onToggle={onToggleRestroomGate} />'
)

with open('frontend/src/components/office/OfficeEnvironment.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(oe)
print('OfficeEnvironment.tsx updated with openable cabin gates, war room gates, and animated restrooms!')
