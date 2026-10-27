import re

# 1. Update OfficeEnvironment.tsx
with open('frontend/src/components/office/OfficeEnvironment.tsx', 'r', encoding='utf-8') as f:
    env_text = f.read()

# Replace RealisticDeveloperDesk chair position from -0.72 to 0.62
env_text = env_text.replace(
    '<RealisticOfficeChair position={[0, 0, -0.72]} rotationY={0} />',
    '<RealisticOfficeChair position={[0, 0, 0.62]} rotationY={0} />'
)

# Replace Aditya's chair and add keyboard/mouse
aditya_old = '''        {/* Triple Ultra-Wide Curved OLED Displays */}
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

        {/* Realistic Executive Leather Chair */}
        <RealisticOfficeChair position={[0, 0, -0.85]} rotationY={0} />'''

aditya_new = '''        {/* Triple Ultra-Wide Curved OLED Displays */}
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
        <RealisticOfficeChair position={[0, 0, 0.68]} rotationY={0} />'''
env_text = env_text.replace(aditya_old, aditya_new, 1)

# Replace Giriraj's chair and add keyboard/mouse
giriraj_old = '''        {/* Architecture Whiteboard with DAG Flowchart on North Wall */}
        <mesh position={[0, 2.2, -3.78]}>
          <planeGeometry args={[5.0, 2.2]} />
          <meshStandardMaterial map={whiteboardTex} roughness={0.2} />
        </mesh>

        <RealisticOfficeChair position={[0, 0, -0.85]} rotationY={0} />'''

giriraj_new = '''        {/* Architecture Whiteboard with DAG Flowchart on North Wall */}
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
        <RealisticOfficeChair position={[0, 0, 0.68]} rotationY={0} />'''
env_text = env_text.replace(giriraj_old, giriraj_new, 1)

# Replace QA Workbench chairs
qa_old = '''        <RealisticOfficeChair position={[-0.8, 0, -0.7]} rotationY={0} />
        <RealisticOfficeChair position={[0.8, 0, -0.7]} rotationY={0} />'''

qa_new = '''        {/* QA Test Keyboards & Tablets */}
        <mesh position={[-0.8, 0.75, 0.18]}>
          <boxGeometry args={[0.52, 0.02, 0.18]} />
          <meshStandardMaterial color="#020617" emissive="#34d399" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.8, 0.75, 0.18]}>
          <boxGeometry args={[0.52, 0.02, 0.18]} />
          <meshStandardMaterial color="#020617" emissive="#34d399" emissiveIntensity={0.3} />
        </mesh>

        {/* QA Test Chairs facing North towards workbench */}
        <RealisticOfficeChair position={[-0.8, 0, 0.68]} rotationY={0} />
        <RealisticOfficeChair position={[0.8, 0, 0.68]} rotationY={0} />'''
env_text = env_text.replace(qa_old, qa_new, 1)

# Replace exterior walls color from #0d1117 to executive slate #1e293b with architectural panels
env_text = env_text.replace(
    '<meshStandardMaterial color="#0d1117" roughness={0.85} />',
    '<meshStandardMaterial color="#1e293b" roughness={0.45} metalness={0.25} />'
)

# Replace company names to E-Connect Solutions
env_text = env_text.replace('SWARM ENGINEERING HQ', 'E-CONNECT SOLUTIONS HQ')
env_text = env_text.replace('SWARM HQ ENTRANCE', 'E-CONNECT SOLUTIONS ENTRANCE')
env_text = env_text.replace('Swarm HQ Gate', 'E-Connect Gate')
env_text = env_text.replace('SWARM CORE ARCHITECTURE', 'E-CONNECT SOLUTIONS ARCHITECTURE')

with open('frontend/src/components/office/OfficeEnvironment.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(env_text)
print('Updated OfficeEnvironment.tsx furniture & walls successfully')
