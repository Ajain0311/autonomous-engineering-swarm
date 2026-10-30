with open('frontend/src/components/office/PlayerAvatar.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Expand Conference / War Room proximity radius to 3.8m so it's easy to reach from both hallway and entrance
text = text.replace(
    "const distConf = Math.hypot(playerPos.current.x - (-9.15), playerPos.current.z - 0);\n    setIsNearConfGate(distConf < 2.5);",
    "const distConf = Math.hypot(playerPos.current.x - (-9.15), playerPos.current.z - 0);\n    setIsNearConfGate(distConf < 3.8);"
)

# 2. In onKeyDown handler, prioritize War Room toggle when isNearConfGate is true
old_keydown_conf = """        if (isNearConfGate && onToggleConferenceGate) {
          onToggleConferenceGate();
          return;
        }"""

new_keydown_conf = """        if (isNearConfGate && onToggleConferenceGate) {
          onToggleConferenceGate();
          return;
        }"""

# In case nearestEmployee takes priority over the door when player is standing at the door:
old_e_handler = """        if (nearestEmployee) {
          if (onTalkToEmployee) {
            onTalkToEmployee(nearestEmployee);
          } else {
            onInspectEmployee(nearestEmployee);
          }
          return;
        }

        if (isNearSofa) {"""

new_e_handler = """        if (isNearConfGate && onToggleConferenceGate) {
          onToggleConferenceGate();
          return;
        }

        if (isNearAdityaGate && onToggleAdityaGate) {
          onToggleAdityaGate();
          return;
        }

        if (isNearGirirajGate && onToggleGirirajGate) {
          onToggleGirirajGate();
          return;
        }

        if (nearestEmployee) {
          if (onTalkToEmployee) {
            onTalkToEmployee(nearestEmployee);
          } else {
            onInspectEmployee(nearestEmployee);
          }
          return;
        }

        if (isNearSofa) {"""

text = text.replace(old_e_handler, new_e_handler)

with open('frontend/src/components/office/PlayerAvatar.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated PlayerAvatar with priority and generous trigger radius for War Room door!')
