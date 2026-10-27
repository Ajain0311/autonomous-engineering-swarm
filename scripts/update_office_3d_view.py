with open('frontend/src/components/office/Office3DView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add import
target_import = "import { EditEmployeeModal } from './EditEmployeeModal';"
replacement_import = "import { EditEmployeeModal } from './EditEmployeeModal';\nimport { ChotuKumarDialogueModal } from './ChotuKumarDialogueModal';"
text = text.replace(target_import, replacement_import, 1)

# 2. Fix Esha Saini coordinates
target_esha = """    id: 'agent-esha',
    name: 'Esha Saini',
    role: 'UI/UX Designer',
    department: 'Product & Design',
    parent_id: 'agent-giriraj',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 17,
    tasks_failed: 0,
    model: 'Gemini 1.5 Pro',
    desk_id: 'desk-esha',
    home_coords: [-14, 0, 10],
    current_coords: [-14, 0, 10],"""

replacement_esha = """    id: 'agent-esha',
    name: 'Esha Saini',
    role: 'UI/UX Designer',
    department: 'Product & Design',
    parent_id: 'agent-giriraj',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 17,
    tasks_failed: 0,
    model: 'Gemini 1.5 Pro',
    desk_id: 'desk-esha',
    home_coords: [-14, 0, 6],
    current_coords: [-14, 0, 6],"""
text = text.replace(target_esha, replacement_esha, 1)

# 3. Add Receptionist Pooja Verma
target_pooja = """    appearance: {
      hairStyle: 'short',
      hairColor: '#1c1917',
      clothingStyle: 'polo',
      clothingColor: '#ca8a04',
      pantsColor: '#334155',
      skinTone: '#f5d0b5',
      hasGlasses: false,
      accessory: 'lanyard'
    }
  }
];"""

replacement_pooja = """    appearance: {
      hairStyle: 'short',
      hairColor: '#1c1917',
      clothingStyle: 'polo',
      clothingColor: '#ca8a04',
      pantsColor: '#334155',
      skinTone: '#f5d0b5',
      hasGlasses: false,
      accessory: 'lanyard'
    }
  },
  {
    id: 'agent-pooja',
    name: 'Pooja Verma',
    role: 'Front Desk & Reception Coordinator',
    department: 'Operations',
    parent_id: 'agent-sanjay',
    status: 'IDLE',
    current_task_id: null,
    tasks_completed: 25,
    tasks_failed: 0,
    model: 'Gemini 1.5 Flash',
    desk_id: 'desk-reception',
    home_coords: [5.5, 0, 12.0],
    current_coords: [5.5, 0, 12.0],
    target_coords: null,
    rotation_y: 0,
    action: 'SIT',
    appearance: {
      hairStyle: 'long',
      hairColor: '#09090b',
      clothingStyle: 'blazer',
      clothingColor: '#0284c7',
      pantsColor: '#0f172a',
      skinTone: '#f5d0b5',
      hasGlasses: false,
      accessory: 'lanyard'
    }
  }
];"""
text = text.replace(target_pooja, replacement_pooja, 1)

# 4. Add states
target_state = "  const [isWalkMode, setIsWalkMode] = useState<boolean>(true);"
replacement_state = """  const [isWalkMode, setIsWalkMode] = useState<boolean>(true);
  const [isGateOpen, setIsGateOpen] = useState<boolean>(false);
  const [activeDialogueEmployee, setActiveDialogueEmployee] = useState<OfficeEmployeeData | null>(null);"""
text = text.replace(target_state, replacement_state, 1)

# 5. Add G key listener
target_key_g = "      if (e.key === 'Escape') {\n        setIsWalkMode(false);"
replacement_key_g = """      if (e.key === 'Escape') {
        setIsWalkMode(false);
        setActiveDialogueEmployee(null);
      } else if (e.key === 'g' || e.key === 'G') {
        setIsGateOpen((prev) => !prev);"""
text = text.replace(target_key_g, replacement_key_g, 1)

# 6. Update OfficeScene props
target_scene_props = """        isWalkMode={isWalkMode}
        onToggleWalkMode={() => setIsWalkMode(!isWalkMode)}
      />"""

replacement_scene_props = """        isWalkMode={isWalkMode}
        onToggleWalkMode={() => setIsWalkMode(!isWalkMode)}
        isGateOpen={isGateOpen}
        onToggleGate={() => setIsGateOpen((prev) => !prev)}
        onTalkToEmployee={(emp) => setActiveDialogueEmployee(emp)}
      />"""
text = text.replace(target_scene_props, replacement_scene_props, 1)

# 7. Render ChotuKumarDialogueModal
target_dialogue = """      {/* Edit Employee Modal */}
      <EditEmployeeModal
        employee={editingEmployee}
        isOpen={Boolean(editingEmployee)}
        onClose={() => setEditingEmployee(null)}
        onUpdateEmployee={handleUpdateEmployee}
        existingEmployees={employees}
      />
    </div>"""

replacement_dialogue = """      {/* Edit Employee Modal */}
      <EditEmployeeModal
        employee={editingEmployee}
        isOpen={Boolean(editingEmployee)}
        onClose={() => setEditingEmployee(null)}
        onUpdateEmployee={handleUpdateEmployee}
        existingEmployees={employees}
      />

      {/* Interactive Speaker Dialogue between Owner Chotu Kumar and Employees */}
      {activeDialogueEmployee && (
        <ChotuKumarDialogueModal
          employee={activeDialogueEmployee}
          onClose={() => setActiveDialogueEmployee(null)}
        />
      )}
    </div>"""
text = text.replace(target_dialogue, replacement_dialogue, 1)

with open('frontend/src/components/office/Office3DView.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)
print('Updated Office3DView.tsx successfully')
