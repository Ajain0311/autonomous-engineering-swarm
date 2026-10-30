with open('frontend/src/components/office/HumanoidCharacter.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update HumanoidCharacterProps to accept isOwnerNearby?: boolean
text = text.replace(
    "interface HumanoidCharacterProps {\n  employee: OfficeEmployeeData;\n  speech: SpeechBubbleItem | null;\n  isSelected: boolean;\n  onSelect: (emp: OfficeEmployeeData) => void;\n  speedMultiplier: number;\n}",
    "interface HumanoidCharacterProps {\n  employee: OfficeEmployeeData;\n  speech: SpeechBubbleItem | null;\n  isSelected: boolean;\n  onSelect: (emp: OfficeEmployeeData) => void;\n  speedMultiplier: number;\n  isOwnerNearby?: boolean;\n}"
)

text = text.replace(
    "  onSelect,\n  speedMultiplier\n}) => {",
    "  onSelect,\n  speedMultiplier,\n  isOwnerNearby = false\n}) => {"
)

# 2. Add lying on table pose for Bhupendra when owner is nearby!
lazy_table_sleep_code = """    const isBhupendra = employee.id === 'agent-bhupendra' || employee.name.includes('Bhupendra');

    // SPECIAL ANIMATION: When Owner Manoj Bhai is nearby, Bhupendra leaves chair and lies down flat on the desk/table sleeping!
    if (isBhupendra && isOwnerNearby) {
      // Elevate onto desk surface (table height ~0.78m) and lay flat horizontally (rotation X = 90 deg)
      groupRef.current.position.set(currentPos.current.x, 0.78, currentPos.current.z - 0.55);
      groupRef.current.rotation.set(-Math.PI / 2, 0, Math.PI / 2);

      // Relaxed straight legs while sleeping on desk
      if (leftLegRef.current) {
        leftLegRef.current.rotation.set(0, 0, 0.05);
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.set(0, 0, -0.05);
      }
      // Sleeping arms folded under head or rested on chest
      if (leftArmRef.current) {
        leftArmRef.current.rotation.set(-1.2, 0, 0.4);
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.set(-1.2, 0, -0.4);
      }
      if (headRef.current) {
        headRef.current.rotation.set(0, 0, 0.3); // Tilted sleeping head
      }
      return;
    }"""

text = text.replace(
    "    // Action-specific kinematics\n    if (action === 'SIT' || action === 'CODE') {",
    "    // Action-specific kinematics\n" + lazy_table_sleep_code + "\n\n    if (action === 'SIT' || action === 'CODE') {"
)

with open('frontend/src/components/office/HumanoidCharacter.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated HumanoidCharacter with lying on table sleep animation for Bhupendra!')
