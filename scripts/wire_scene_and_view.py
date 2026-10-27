import re

# ==============================================================================
# 1. UPDATE OfficeScene.tsx
# ==============================================================================
with open('frontend/src/components/office/OfficeScene.tsx', 'r', encoding='utf-8') as f:
    os_text = f.read()

# Add gate props to OfficeSceneProps
old_os_props = '''  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}'''

new_os_props = '''  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isAdityaGateOpen?: boolean;
  onToggleAdityaGate?: () => void;
  isGirirajGateOpen?: boolean;
  onToggleGirirajGate?: () => void;
  isConferenceGateOpen?: boolean;
  onToggleConferenceGate?: () => void;
  isRestroomGateOpen?: boolean;
  onToggleRestroomGate?: () => void;
}'''
os_text = os_text.replace(old_os_props, new_os_props)

old_os_destruct = '''  isFullscreen = false,
  onToggleFullscreen
}) => {'''

new_os_destruct = '''  isFullscreen = false,
  onToggleFullscreen,
  isAdityaGateOpen = false,
  onToggleAdityaGate,
  isGirirajGateOpen = false,
  onToggleGirirajGate,
  isConferenceGateOpen = false,
  onToggleConferenceGate,
  isRestroomGateOpen = false,
  onToggleRestroomGate
}) => {'''
os_text = os_text.replace(old_os_destruct, new_os_destruct)

# Pass to PlayerAvatar
old_player_avatar = '''        {/* Dynamic Walk-In Player Avatar (Chotu Kumar - Company Owner) */}
        <PlayerAvatar
          isActive={isWalkMode}
          employees={employees}
          onInspectEmployee={onSelectEmployee}
          controlsRef={controlsRef}
          onActivateWalkMode={onToggleWalkMode}
          onTalkToEmployee={onTalkToEmployee}
          onToggleGate={onToggleGate}
          isGateOpen={isGateOpen}
        />'''

new_player_avatar = '''        {/* Dynamic Walk-In Player Avatar (Chotu Kumar - Company Owner) */}
        <PlayerAvatar
          isActive={isWalkMode}
          employees={employees}
          onInspectEmployee={onSelectEmployee}
          controlsRef={controlsRef}
          onActivateWalkMode={onToggleWalkMode}
          onTalkToEmployee={onTalkToEmployee}
          onToggleGate={onToggleGate}
          isGateOpen={isGateOpen}
          isAdityaGateOpen={isAdityaGateOpen}
          onToggleAdityaGate={onToggleAdityaGate}
          isGirirajGateOpen={isGirirajGateOpen}
          onToggleGirirajGate={onToggleGirirajGate}
          isConferenceGateOpen={isConferenceGateOpen}
          onToggleConferenceGate={onToggleConferenceGate}
          isRestroomGateOpen={isRestroomGateOpen}
          onToggleRestroomGate={onToggleRestroomGate}
        />'''
os_text = os_text.replace(old_player_avatar, new_player_avatar)

# Pass to OfficeEnvironment
old_oe_call = '<OfficeEnvironment onSelectZone={onSelectZone} isGateOpen={isGateOpen} onToggleGate={onToggleGate} />'
new_oe_call = '''<OfficeEnvironment
          onSelectZone={onSelectZone}
          isGateOpen={isGateOpen}
          onToggleGate={onToggleGate}
          isAdityaGateOpen={isAdityaGateOpen}
          onToggleAdityaGate={onToggleAdityaGate}
          isGirirajGateOpen={isGirirajGateOpen}
          onToggleGirirajGate={onToggleGirirajGate}
          isConferenceGateOpen={isConferenceGateOpen}
          onToggleConferenceGate={onToggleConferenceGate}
          isRestroomGateOpen={isRestroomGateOpen}
          onToggleRestroomGate={onToggleRestroomGate}
        />'''
os_text = os_text.replace(old_oe_call, new_oe_call)

with open('frontend/src/components/office/OfficeScene.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(os_text)
print('OfficeScene.tsx updated successfully!')


# ==============================================================================
# 2. UPDATE Office3DView.tsx
# ==============================================================================
with open('frontend/src/components/office/Office3DView.tsx', 'r', encoding='utf-8') as f:
    ov_text = f.read()

# Fix Abhishek Hingar coords: [12.2, 0, 1.18]
ov_text = ov_text.replace(
    '''    desk_id: 'desk-abhishek',
    home_coords: [11, 0, 0],
    current_coords: [11, 0, 0],''',
    '''    desk_id: 'desk-abhishek',
    home_coords: [12.2, 0, 1.18],
    current_coords: [12.2, 0, 1.18],'''
)

# Fix Ashish Das coords: [13.8, 0, 1.18]
ov_text = ov_text.replace(
    '''    desk_id: 'desk-ashish',
    home_coords: [14, 0, 0],
    current_coords: [14, 0, 0],''',
    '''    desk_id: 'desk-ashish',
    home_coords: [13.8, 0, 1.18],
    current_coords: [13.8, 0, 1.18],'''
)

# Fix Harshit Purohit coords: [11.5, 0, 10.12]
ov_text = ov_text.replace(
    '''    desk_id: 'desk-harshit-p',
    home_coords: [11, 0, 10],
    current_coords: [11, 0, 10],''',
    '''    desk_id: 'desk-harshit-p',
    home_coords: [11.5, 0, 10.12],
    current_coords: [11.5, 0, 10.12],'''
)

# Add Gate states
old_gate_state = '  const [isGateOpen, setIsGateOpen] = useState<boolean>(false);'
new_gate_states = '''  const [isGateOpen, setIsGateOpen] = useState<boolean>(false);
  const [isAdityaGateOpen, setIsAdityaGateOpen] = useState<boolean>(false);
  const [isGirirajGateOpen, setIsGirirajGateOpen] = useState<boolean>(false);
  const [isConferenceGateOpen, setIsConferenceGateOpen] = useState<boolean>(false);
  const [isRestroomGateOpen, setIsRestroomGateOpen] = useState<boolean>(false);

  const handleToggleAdityaGate = () => setIsAdityaGateOpen((prev) => !prev);
  const handleToggleGirirajGate = () => setIsGirirajGateOpen((prev) => !prev);
  const handleToggleConferenceGate = () => setIsConferenceGateOpen((prev) => !prev);
  const handleToggleRestroomGate = () => setIsRestroomGateOpen((prev) => !prev);'''
ov_text = ov_text.replace(old_gate_state, new_gate_states)

# Pass gate props to OfficeScene
old_scene_render = '''        <OfficeScene
          employees={visibleEmployees}
          speechMap={speechMap}
          selectedEmployeeId={selectedEmployeeId}
          onSelectEmployee={handleSelectEmployee}
          onSelectZone={handleSelectZone}
          cameraPreset={cameraPreset}
          speedMultiplier={speedMultiplier}
          performanceMode={performanceMode}
          followedEmployee={followedEmployee}
          activeRoutePoints={activeRoutePoints}
          isWalkMode={isWalkMode}
          onToggleWalkMode={() => setIsWalkMode((prev) => !prev)}
          isGateOpen={isGateOpen}
          onToggleGate={handleToggleGate}
          onTalkToEmployee={(emp) => setActiveDialogueEmployee(emp)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />'''

new_scene_render = '''        <OfficeScene
          employees={visibleEmployees}
          speechMap={speechMap}
          selectedEmployeeId={selectedEmployeeId}
          onSelectEmployee={handleSelectEmployee}
          onSelectZone={handleSelectZone}
          cameraPreset={cameraPreset}
          speedMultiplier={speedMultiplier}
          performanceMode={performanceMode}
          followedEmployee={followedEmployee}
          activeRoutePoints={activeRoutePoints}
          isWalkMode={isWalkMode}
          onToggleWalkMode={() => setIsWalkMode((prev) => !prev)}
          isGateOpen={isGateOpen}
          onToggleGate={handleToggleGate}
          isAdityaGateOpen={isAdityaGateOpen}
          onToggleAdityaGate={handleToggleAdityaGate}
          isGirirajGateOpen={isGirirajGateOpen}
          onToggleGirirajGate={handleToggleGirirajGate}
          isConferenceGateOpen={isConferenceGateOpen}
          onToggleConferenceGate={handleToggleConferenceGate}
          isRestroomGateOpen={isRestroomGateOpen}
          onToggleRestroomGate={handleToggleRestroomGate}
          onTalkToEmployee={(emp) => setActiveDialogueEmployee(emp)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />'''
ov_text = ov_text.replace(old_scene_render, new_scene_render)

with open('frontend/src/components/office/Office3DView.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(ov_text)
print('Office3DView.tsx updated successfully!')
