with open('frontend/src/components/office/OfficeEnvironment.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add RECEPTION 3D / Html Signboard on Pooja Verma's Reception Desk
reception_target = """          <mesh position={[0, 0.6, 0.52]}>
            <planeGeometry args={[3.0, 0.08]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.5} />
          </mesh>"""

reception_replacement = """          <mesh position={[0, 0.6, 0.52]}>
            <planeGeometry args={[3.0, 0.08]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.5} />
          </mesh>
          {/* Luminous RECEPTION Desk Badge */}
          <Html position={[0, 0.6, 0.55]} center style={{ pointerEvents: 'none' }}>
            <div className="select-none px-3 py-0.5 rounded-lg bg-slate-950/90 border border-sky-400 text-sky-300 font-mono font-black text-[10px] tracking-widest shadow-[0_0_12px_rgba(56,189,248,0.6)] uppercase whitespace-nowrap">
              🛎️ RECEPTION • POOJA VERMA
            </div>
          </Html>"""

text = text.replace(reception_target, reception_replacement)

# 2. Brighten office walls from gloomy dark slate (#1e293b / #161b22) to modern sleek bright architectural tone (#94a3b8 / #cbd5e1 / #e2e8f0 with warm ambient)
text = text.replace('color="#1e293b" roughness={0.45} metalness={0.25}', 'color="#64748b" roughness={0.65} metalness={0.1}')
text = text.replace('color="#161b22" roughness={0.6} metalness={0.3}', 'color="#475569" roughness={0.7} metalness={0.15}')

with open('frontend/src/components/office/OfficeEnvironment.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated Reception desk badge and brightened office wall colors!')
