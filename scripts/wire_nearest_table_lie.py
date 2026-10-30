# 1. Update PlayerAvatar.tsx to report nearestEmployeeId change back to parent via onNearestEmployeeChange
with open('frontend/src/components/office/PlayerAvatar.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    "  onTalkToEmployee?: (emp: OfficeEmployeeData) => void;\n  activeDialogueEmployeeId?: string | null;",
    "  onTalkToEmployee?: (emp: OfficeEmployeeData) => void;\n  activeDialogueEmployeeId?: string | null;\n  onNearestEmployeeChange?: (empId: string | null) => void;"
)

text = text.replace(
    "  onTalkToEmployee,\n  activeDialogueEmployeeId = null,",
    "  onTalkToEmployee,\n  activeDialogueEmployeeId = null,\n  onNearestEmployeeChange,"
)

old_set_closest = """    setNearestEmployee(closest);"""
new_set_closest = """    setNearestEmployee(closest);
    if (onNearestEmployeeChange) {
      onNearestEmployeeChange(closest ? closest.id : null);
    }"""

text = text.replace(old_set_closest, new_set_closest)

with open('frontend/src/components/office/PlayerAvatar.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

# 2. Update OfficeScene.tsx to hold nearestEmployeeId state and pass it down
with open('frontend/src/components/office/OfficeScene.tsx', 'r', encoding='utf-8') as f:
    scene_text = f.read()

avatar_call_old = """        <PlayerAvatar
          isActive={isWalkMode}
          employees={employees}
          onInspectEmployee={onSelectEmployee}
          controlsRef={controlsRef}
          onActivateWalkMode={onToggleWalkMode}
          onTalkToEmployee={onTalkToEmployee}
          activeDialogueEmployeeId={activeDialogueEmployeeId}
          onLeaveEmployeeZone={onLeaveEmployeeZone}
          onToggleGate={onToggleGate}"""

scene_state = """  const controlsRef = useRef<any>(null);
  const [currentNearestId, setCurrentNearestId] = useState<string | null>(null);"""

scene_text = scene_text.replace("  const controlsRef = useRef<any>(null);", scene_state)

avatar_call_new = """        <PlayerAvatar
          isActive={isWalkMode}
          employees={employees}
          onInspectEmployee={onSelectEmployee}
          controlsRef={controlsRef}
          onActivateWalkMode={onToggleWalkMode}
          onTalkToEmployee={onTalkToEmployee}
          activeDialogueEmployeeId={activeDialogueEmployeeId}
          onNearestEmployeeChange={setCurrentNearestId}
          onLeaveEmployeeZone={onLeaveEmployeeZone}
          onToggleGate={onToggleGate}"""

scene_text = scene_text.replace(avatar_call_old, avatar_call_new)

scene_text = scene_text.replace(
    "isOwnerNearby={isWalkMode && (nearestEmployeeId === emp.id || activeDialogueEmployeeId === emp.id)}",
    "isOwnerNearby={isWalkMode && (currentNearestId === emp.id || activeDialogueEmployeeId === emp.id)}"
)

with open('frontend/src/components/office/OfficeScene.tsx', 'w', encoding='utf-8') as f:
    f.write(scene_text)

print('Wired nearest employee live reporting for lying down on table!')
