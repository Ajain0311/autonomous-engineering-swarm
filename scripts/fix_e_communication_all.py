with open('frontend/src/components/office/PlayerAvatar.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Expand employee proximity detection radius to 3.8 meters so ANY employee sitting or walking is easily detected!
text = text.replace("let minDist = 2.6;", "let minDist = 3.8;")

# 2. Keydown handler: make sure nearestEmployee ALWAYS works reliably, and gate toggles work smoothly!
old_e_handler = """        if (isNearConfGate && onToggleConferenceGate) {
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
        }"""

new_e_handler = """        // Priority 1: If close to an employee, ALWAYS open conversation dialogue!
        if (nearestEmployee) {
          if (onTalkToEmployee) {
            onTalkToEmployee(nearestEmployee);
          } else {
            onInspectEmployee(nearestEmployee);
          }
          return;
        }

        // Priority 2: Room Gate Doors
        if (isNearConfGate && onToggleConferenceGate) {
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
        }"""

text = text.replace(old_e_handler, new_e_handler)

# 3. Add Bhupendra's funny random living ambient line when Manoj Bhai walks near him
bhupendra_funny_ambient = """      if (isBhupendra) {
        funnyLine = 'Bhupendra dheere se: Oye chips daa packet mangao ree koi... Manoj veere tu fir aa gaya! Main te sone jaa reha aan!';"""

text = text.replace("      if (isBhupendra) {\n        funnyLine = 'Bhupendra dheere se: Arre Manoj bhai idhar hi khade hain, jaldi se document kholo warna bolenge alash kar raha hu!';", bhupendra_funny_ambient)

with open('frontend/src/components/office/PlayerAvatar.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated PlayerAvatar with 3.8m employee detection radius and instant conversation trigger!')
