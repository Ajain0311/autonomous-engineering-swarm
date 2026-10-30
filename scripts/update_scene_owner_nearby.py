with open('frontend/src/components/office/OfficeScene.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update OfficeSceneProps to optionally accept ownerCoords or nearbyEmployeeId
# In OfficeScene, we have activeDialogueEmployeeId, and we can also track nearby employee to avatar!
# Pass nearbyEmployeeId or calculate isOwnerNearby:
text = text.replace(
    "  onTalkToEmployee?: (emp: OfficeEmployeeData) => void;\n  activeDialogueEmployeeId?: string | null;",
    "  onTalkToEmployee?: (emp: OfficeEmployeeData) => void;\n  activeDialogueEmployeeId?: string | null;\n  nearestEmployeeId?: string | null;"
)

text = text.replace(
    "  onTalkToEmployee,\n  activeDialogueEmployeeId = null,\n  onLeaveEmployeeZone,",
    "  onTalkToEmployee,\n  activeDialogueEmployeeId = null,\n  nearestEmployeeId = null,\n  onLeaveEmployeeZone,"
)

# In employees.map:
char_call_old = """          <HumanoidCharacter
            key={emp.id}
            employee={emp}
            speech={speechMap[emp.id] || null}
            isSelected={selectedEmployeeId === emp.id}
            onSelect={onSelectEmployee}
            speedMultiplier={speedMultiplier}
          />"""

char_call_new = """          <HumanoidCharacter
            key={emp.id}
            employee={emp}
            speech={speechMap[emp.id] || null}
            isSelected={selectedEmployeeId === emp.id}
            onSelect={onSelectEmployee}
            speedMultiplier={speedMultiplier}
            isOwnerNearby={isWalkMode && (nearestEmployeeId === emp.id || activeDialogueEmployeeId === emp.id)}
          />"""

text = text.replace(char_call_old, char_call_new)

with open('frontend/src/components/office/OfficeScene.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated OfficeScene to pass isOwnerNearby to HumanoidCharacter!')
