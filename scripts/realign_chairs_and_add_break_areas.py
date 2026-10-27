with open('frontend/src/components/office/OfficeEnvironment.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update RealisticDeveloperDesk chair rotation to Math.PI (so backrest is behind, facing North towards desk)
text = text.replace(
    '<RealisticOfficeChair position={[0, 0, 0.62]} rotationY={0} />',
    '<RealisticOfficeChair position={[0, 0, 0.62]} rotationY={Math.PI} />'
)

# 2. Update Aditya's chair rotation to Math.PI
text = text.replace(
    '<RealisticOfficeChair position={[0, 0, 0.68]} rotationY={0} />',
    '<RealisticOfficeChair position={[0, 0, 0.68]} rotationY={Math.PI} />'
)

# 3. Update Giriraj's chair rotation to Math.PI
giriraj_old = '''        {/* Realistic Lead Office Chair facing North towards desk */}
        <RealisticOfficeChair position={[0, 0, 0.68]} rotationY={0} />'''
giriraj_new = '''        {/* Realistic Lead Office Chair facing North towards desk */}
        <RealisticOfficeChair position={[0, 0, 0.68]} rotationY={Math.PI} />'''
text = text.replace(giriraj_old, giriraj_new, 1)

# 4. Update QA chairs rotation to Math.PI
qa_old = '''        {/* QA Test Chairs facing North towards workbench */}
        <RealisticOfficeChair position={[-0.8, 0, 0.68]} rotationY={0} />
        <RealisticOfficeChair position={[0.8, 0, 0.68]} rotationY={0} />'''
qa_new = '''        {/* QA Test Chairs facing North towards workbench */}
        <RealisticOfficeChair position={[-0.8, 0, 0.68]} rotationY={Math.PI} />
        <RealisticOfficeChair position={[0.8, 0, 0.68]} rotationY={Math.PI} />'''
text = text.replace(qa_old, qa_new, 1)

# 5. Add ExecutiveLoungeSofa and RestroomsPortal components before OfficeEnvironment
components_to_insert = '''
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

// Modern Restrooms Portal with Signage
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
);
'''

target_before_export = 'export const OfficeEnvironment: React.FC<OfficeEnvironmentProps> = ({ onSelectZone, isGateOpen = false, onToggleGate }) => {'
text = text.replace(target_before_export, components_to_insert + target_before_export, 1)

# 6. Add ExecutiveLoungeSofa & RestroomsPortal inside OfficeEnvironment return JSX
target_return_end = '''          {/* Ergonomic Reception Chair */}
          <RealisticOfficeChair position={[0, 0, -0.65]} rotationY={0} />
        </group>
      </group>
    </group>
  );'''

replacement_return_end = '''          {/* Ergonomic Reception Chair */}
          <RealisticOfficeChair position={[0, 0, -0.65]} rotationY={0} />
        </group>
      </group>

      {/* ==================== 10. EXECUTIVE LOUNGE SOFA (MAX 3) & RESTROOMS ==================== */}
      <ExecutiveLoungeSofa position={[-12.5, 0, 10.5]} />
      <RestroomsPortal position={[-19.8, 0, 14.5]} />
    </group>
  );'''
text = text.replace(target_return_end, replacement_return_end, 1)

with open('frontend/src/components/office/OfficeEnvironment.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)
print('Updated OfficeEnvironment.tsx with chair rotations, Lounge Sofa and Restrooms successfully')
