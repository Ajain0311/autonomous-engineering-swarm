with open('frontend/src/components/office/Office3DView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update imports
target_import = "import { EditEmployeeModal } from './EditEmployeeModal';"
replacement_import = "import { EditEmployeeModal } from './EditEmployeeModal';\nimport { Maximize2, Minimize2 } from 'lucide-react';"
if "Maximize2" not in text:
    text = text.replace(target_import, replacement_import, 1)

# 2. Update all employee sitting coordinates so they sit directly in chairs facing their desks
coords_updates = [
    # Aditya Jain
    ("home_coords: [-14, 0, -10],\n    current_coords: [-14, 0, -10],", "home_coords: [-14, 0, -9.32],\n    current_coords: [-14, 0, -9.32],"),
    # Sanjay Sahlot
    ("home_coords: [-7, 0, -10],\n    current_coords: [-7, 0, -10],", "home_coords: [-7, 0, -9.38],\n    current_coords: [-7, 0, -9.38],"),
    # Giriraj Mali
    ("home_coords: [13, 0, -10],\n    current_coords: [13, 0, -10],", "home_coords: [13, 0, -9.32],\n    current_coords: [13, 0, -9.32],"),
    # Bhupendra Jingar
    ("home_coords: [-14, 0, 0],\n    current_coords: [-14, 0, 0],", "home_coords: [-13.5, 0, 0.6],\n    current_coords: [-13.5, 0, 0.6],"),
    # Abhishek Hingar
    ("home_coords: [11, 0, 0.5],\n    current_coords: [11, 0, 0.5],", "home_coords: [12.2, 0, 1.18],\n    current_coords: [12.2, 0, 1.18],"),
    # Ashish Das
    ("home_coords: [14, 0, 0.5],\n    current_coords: [14, 0, 0.5],", "home_coords: [13.8, 0, 1.18],\n    current_coords: [13.8, 0, 1.18],"),
    # Rohan Sharma
    ("home_coords: [-4, 0, -2],\n    current_coords: [-4, 0, -2],", "home_coords: [-4, 0, -1.38],\n    current_coords: [-4, 0, -1.38],"),
    # Shaurya Jain
    ("home_coords: [-4, 0, 2],\n    current_coords: [-4, 0, 2],", "home_coords: [-4, 0, 2.62],\n    current_coords: [-4, 0, 2.62],"),
    # Binod Kumar
    ("home_coords: [-4, 0, 6],\n    current_coords: [-4, 0, 6],", "home_coords: [-4, 0, 6.62],\n    current_coords: [-4, 0, 6.62],"),
    # Mohit Sharma
    ("home_coords: [0, 0, -2],\n    current_coords: [0, 0, -2],", "home_coords: [0, 0, -1.38],\n    current_coords: [0, 0, -1.38],"),
    # Harshit Purohit
    ("home_coords: [11, 0, 10.5],\n    current_coords: [11, 0, 10.5],", "home_coords: [11.5, 0, 10.12],\n    current_coords: [11.5, 0, 10.12],"),
    # Divisha Joshi
    ("home_coords: [0, 0, 6],\n    current_coords: [0, 0, 6],", "home_coords: [0, 0, 6.62],\n    current_coords: [0, 0, 6.62],"),
    # Hemang Tiwari
    ("home_coords: [0, 0, 2],\n    current_coords: [0, 0, 2],", "home_coords: [0, 0, 2.62],\n    current_coords: [0, 0, 2.62],"),
    # Esha Saini
    ("home_coords: [-14, 0, 6],\n    current_coords: [-14, 0, 6],", "home_coords: [-14, 0, 6.62],\n    current_coords: [-14, 0, 6.62],"),
    # Kratik Jain
    ("home_coords: [4, 0, 2],\n    current_coords: [4, 0, 2],", "home_coords: [4, 0, 2.62],\n    current_coords: [4, 0, 2.62],"),
    # Maan Singh
    ("home_coords: [4, 0, 6],\n    current_coords: [4, 0, 6],", "home_coords: [4, 0, 6.62],\n    current_coords: [4, 0, 6.62],"),
    # Harshit Masta
    ("home_coords: [-7, 0, -6],\n    current_coords: [-7, 0, -6],", "home_coords: [-7, 0, -5.38],\n    current_coords: [-7, 0, -5.38],"),
    # Kathan Jain
    ("home_coords: [14, 0, 10],\n    current_coords: [14, 0, 10],", "home_coords: [14.5, 0, 10.12],\n    current_coords: [14.5, 0, 10.12],"),
    # Pooja Verma
    ("home_coords: [5.5, 0, 12.0],\n    current_coords: [5.5, 0, 12.0],", "home_coords: [5.5, 0, 11.85],\n    current_coords: [5.5, 0, 11.85],")
]

for old_c, new_c in coords_updates:
    if old_c in text:
        text = text.replace(old_c, new_c, 1)

# 3. Add Fullscreen state and handler
target_states = "  const [isGateOpen, setIsGateOpen] = useState<boolean>(false);"
replacement_states = """  const [isGateOpen, setIsGateOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  React.useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);"""
if "toggleFullscreen" not in text:
    text = text.replace(target_states, replacement_states, 1)

# 4. Update container div with ref and fullscreen styling
target_div = '<div className="relative w-full h-[780px] rounded-3xl overflow-hidden border-2 border-sky-500/40 shadow-[0_0_50px_rgba(2,132,199,0.25)] bg-slate-950">'
replacement_div = '<div ref={containerRef} className={`relative w-full ${isFullscreen ? \"fixed inset-0 z-50 h-screen w-screen rounded-none\" : \"h-[780px] rounded-3xl\"} overflow-hidden border-2 border-sky-500/40 shadow-[0_0_50px_rgba(2,132,199,0.25)] bg-slate-950 transition-all`}>'
text = text.replace(target_div, replacement_div, 1)

# 5. Pass isFullscreen & onToggleFullscreen to OfficeControls
target_ctrl = "        totalEmployees={visibleEmployees.length}\n      />"
replacement_ctrl = "        totalEmployees={visibleEmployees.length}\n        isFullscreen={isFullscreen}\n        onToggleFullscreen={toggleFullscreen}\n      />"
text = text.replace(target_ctrl, replacement_ctrl, 1)

# 6. Pass onToggleFullscreen to OfficeScene
target_scene = "        onTalkToEmployee={(emp) => setActiveDialogueEmployee(emp)}\n      />"
replacement_scene = "        onTalkToEmployee={(emp) => setActiveDialogueEmployee(emp)}\n        onToggleFullscreen={toggleFullscreen}\n        isFullscreen={isFullscreen}\n      />"
text = text.replace(target_scene, replacement_scene, 1)

with open('frontend/src/components/office/Office3DView.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)
print('Updated Office3DView.tsx with Fullscreen & Realigned Coords successfully')
