with open('frontend/src/components/office/OfficeScene.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update OfficeSceneProps
target_props = '''  isWalkMode?: boolean;
  onToggleWalkMode?: () => void;
}'''

replacement_props = '''  isWalkMode?: boolean;
  onToggleWalkMode?: () => void;
  isGateOpen?: boolean;
  onToggleGate?: () => void;
  onTalkToEmployee?: (emp: OfficeEmployeeData) => void;
}'''
text = text.replace(target_props, replacement_props, 1)

# 2. Update OfficeScene component arguments
target_args = '''  isWalkMode = false,
  onToggleWalkMode
}) => {'''

replacement_args = '''  isWalkMode = false,
  onToggleWalkMode,
  isGateOpen = false,
  onToggleGate,
  onTalkToEmployee
}) => {'''
text = text.replace(target_args, replacement_args, 1)

# 3. Update PlayerAvatar call in JSX
target_player = '''        {/* Dynamic Walk-In Player Avatar */}
        <PlayerAvatar
          isActive={isWalkMode}
          employees={employees}
          onInspectEmployee={onSelectEmployee}
          controlsRef={controlsRef}
          onActivateWalkMode={onToggleWalkMode}
        />'''

replacement_player = '''        {/* Dynamic Walk-In Player Avatar (Chotu Kumar - Company Owner) */}
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
text = text.replace(target_player, replacement_player, 1)

# 4. Update OfficeEnvironment call in JSX
target_env = '<OfficeEnvironment onSelectZone={onSelectZone} />'
replacement_env = '<OfficeEnvironment onSelectZone={onSelectZone} isGateOpen={isGateOpen} onToggleGate={onToggleGate} />'
text = text.replace(target_env, replacement_env, 1)

# 5. Add Gate button to Walking Pad
target_buttons = '''            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', code: 'KeyE' }))}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow select-none"
              title="Interact / Talk"
            >
              💬 Talk [E]
            </button>'''

replacement_buttons = '''            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', code: 'KeyE' }))}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow select-none"
              title="Interact / Talk"
            >
              💬 Talk [E]
            </button>
            {onToggleGate && (
              <button
                onClick={onToggleGate}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs shadow select-none transition ${
                  isGateOpen ? 'bg-rose-700 hover:bg-rose-600 text-white' : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                }`}
                title="Toggle South Entrance Gate [G]"
              >
                {isGateOpen ? '🔒 Gate [G]' : '🚪 Open Gate [G]'}
              </button>
            )}'''
text = text.replace(target_buttons, replacement_buttons, 1)

with open('frontend/src/components/office/OfficeScene.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)
print('Updated OfficeScene.tsx successfully')
