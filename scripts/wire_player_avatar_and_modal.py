import re

# ==============================================================================
# 1. UPDATE speechTts.ts
# ==============================================================================
with open('frontend/src/utils/speechTts.ts', 'r', encoding='utf-8') as f:
    stts = f.read()

old_speak_sig = 'public speak(text: string) {'
new_speak_sig = '''public speak(text: string, options?: { isPunjabi?: boolean; pitch?: number; rate?: number }) {'''
stts = stts.replace(old_speak_sig, new_speak_sig)

old_utterance_init = '''      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN'; // Explicit Hindi India locale
      utterance.rate = 0.94;    // Human conversational pace
      utterance.pitch = 1.0;

      const voices = this.getAvailableVoices();
      let voice: SpeechSynthesisVoice | undefined;'''

new_utterance_init = '''      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options?.isPunjabi ? 'pa-IN' : 'hi-IN'; // Punjabi or Hindi locale
      utterance.rate = options?.rate ?? (options?.isPunjabi ? 1.02 : 0.94);
      utterance.pitch = options?.pitch ?? (options?.isPunjabi ? 1.06 : 1.0);

      const voices = this.getAvailableVoices();
      let voice: SpeechSynthesisVoice | undefined;

      // 0. If Punjabi banter requested, check for Punjabi voices first
      if (options?.isPunjabi) {
        voice = voices.find(
          (v) =>
            v.lang.toLowerCase().includes('pa') ||
            v.name.toLowerCase().includes('punjabi') ||
            v.name.toLowerCase().includes('raavi') ||
            v.name.toLowerCase().includes('gagan')
        );
      }'''
stts = stts.replace(old_utterance_init, new_utterance_init)

with open('frontend/src/utils/speechTts.ts', 'w', encoding='utf-8', newline='\n') as f:
    f.write(stts)
print('speechTts.ts updated with Punjabi speech support!')


# ==============================================================================
# 2. UPDATE ChotuKumarDialogueModal.tsx
# ==============================================================================
with open('frontend/src/components/office/ChotuKumarDialogueModal.tsx', 'r', encoding='utf-8') as f:
    ck = f.read()

# Replace buildLiveResponse with Punjabi funny banter for Aditya Jain
old_build_live = '''  // Build 100% REAL live response based on the employee's actual active work and system state
  const buildLiveResponse = (qIndex: number): string => {
    const name = employee.name;
    const action = employee.action;
    const status = employee.status;

    // Detect if employee is currently resting at the Executive Lounge Sofa or Restrooms
    const isAtSofa =
      employee.current_coords[0] >= -14.5 &&
      employee.current_coords[0] <= -10.5 &&
      employee.current_coords[2] >= 9.5 &&
      employee.current_coords[2] <= 11.5;
    const isAtRestroom = employee.current_coords[0] < -17 && employee.current_coords[2] > 13.5;'''

new_build_live = '''  // Build 100% REAL live response based on the employee's actual active work and system state
  const buildLiveResponse = (qIndex: number): string => {
    const name = employee.name;
    const action = employee.action;
    const status = employee.status;
    const isAditya = employee.id === 'agent-aditya' || employee.name.includes('Aditya');

    // ==================== SPECIAL PUNJABI FUNNY BANTER (ADITYA JAIN ONLY) ====================
    // Aditya Jain is Chotu Kumar's close personal friend and top authority: witty, informal Punjabi banter!
    if (isAditya) {
      if (qIndex === 0) {
        return `Oye Chotu veer! Kidaan! Main taan full aish kar reha aan cabin ch, AC di thandi hawa vich kadak chai chal rahi ae! Backend waale mundeyan nu chaar gaalan kadhiyaan te saare seedhe raste pe aa gaye. Tu chill maar mere veer, company full profit ch jaau! Bol hor ki sewa kariye tuhanu malik saab?`;
      }
      if (qIndex === 1) {
        return `Oye Chotu! Distribution da ki puchhda ae? Saare dev mundeyan nu kutt-kutt ke kaam karwa reha aan! Giriraj code te hath jod ke betha ae, QA waale bugs labh-labh thak gaye, te DevOps waale server nu fan chala ke thanda kar rahe ne! Scene poora bomb chal reha ae, bas tu saadi salary da check sign kar de time te!`;
      }
      if (qIndex === 2) {
        return `Kedi gall kar reha ae Chotu veer! Blocker di aisi taisi! Jehda bug saade aage aaya, main ohnu chuk ke dustbin vich sut dita! Koi rola-rappa nahi ae paaji, swarm full speed te bhaj reha ae. Chal hun bakchodi band kar te thoda walk karke aish maar office ch!`;
      }
      return `Oye Chotu, tu aish kar veer!`;
    }

    // Detect if employee is currently resting at the Executive Lounge Sofa or Restrooms
    const isAtSofa =
      employee.current_coords[0] >= -14.5 &&
      employee.current_coords[0] <= -10.5 &&
      employee.current_coords[2] >= 9.5 &&
      employee.current_coords[2] <= 11.5;
    const isAtRestroom = employee.current_coords[0] < -17 && employee.current_coords[2] > 13.5;'''
ck = ck.replace(old_build_live, new_build_live)

# Pass isPunjabi to speechTts.speak
old_speak_effect = '''  // Speak live response through speaker
  useEffect(() => {
    speechTts.speak(currentLiveResponse);
  }, [currentLiveResponse, selectedQuestionIndex]);'''

new_speak_effect = '''  // Speak live response through speaker (Punjabi neural voice for Aditya)
  useEffect(() => {
    const isAditya = employee.id === 'agent-aditya' || employee.name.includes('Aditya');
    speechTts.speak(currentLiveResponse, { isPunjabi: isAditya });
  }, [currentLiveResponse, selectedQuestionIndex, employee.id]);'''
ck = ck.replace(old_speak_effect, new_speak_effect)

# Update replay voice
ck = ck.replace(
    'speechTts.speak(currentLiveResponse);',
    'speechTts.speak(currentLiveResponse, { isPunjabi: employee.id === "agent-aditya" || employee.name.includes("Aditya") });'
)

# In the header, if employee is Aditya, show funny friend badge
old_badge = '''            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-bold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{employee.name}</span>
              <span className="text-slate-400 font-mono text-[11px]">({employee.role.split('/')[0].trim()})</span>
            </div>'''

new_badge = '''            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-bold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{employee.name}</span>
              {(employee.id === 'agent-aditya' || employee.name.includes('Aditya')) ? (
                <span className="px-2 py-0.5 rounded bg-amber-500/30 border border-amber-400 text-amber-300 text-[10px] font-black uppercase">
                  ⚡ YAAR / CHIEF (PUNJABI BANTER)
                </span>
              ) : (
                <span className="text-slate-400 font-mono text-[11px]">({employee.role.split('/')[0].trim()})</span>
              )}
            </div>'''
ck = ck.replace(old_badge, new_badge)

with open('frontend/src/components/office/ChotuKumarDialogueModal.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(ck)
print('ChotuKumarDialogueModal.tsx updated with Aditya Jain funny Punjabi banter!')


# ==============================================================================
# 3. UPDATE HumanoidCharacter.tsx: Increase font sizes to readable 11px
# ==============================================================================
with open('frontend/src/components/office/HumanoidCharacter.tsx', 'r', encoding='utf-8') as f:
    hc = f.read()

old_badges = '''          {/* Micro Name Badge */}
          <span
            className={`font-mono font-bold text-[8px] px-1.5 py-0.2 rounded shadow backdrop-blur-sm whitespace-nowrap transition-colors ${
              isSelected
                ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-300'
                : 'bg-slate-950/85 text-slate-100 border border-slate-700/80'
            }`}
          >
            {employee.name}
          </span>
          {/* Micro Role Badge */}
          {employee.role && (
            <span className="text-[7px] font-medium text-slate-300 bg-slate-900/90 px-1 py-0.2 rounded mt-0.5 uppercase border border-slate-700/60 whitespace-nowrap">
              {employee.role.split('/')[0].trim()}
            </span>
          )}'''

new_badges = '''          {/* Readable Crisp Name Badge */}
          <span
            className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded-md shadow-md backdrop-blur-sm whitespace-nowrap transition-colors ${
              isSelected
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                : 'bg-slate-950/90 text-slate-100 border border-slate-700/80'
            }`}
          >
            {employee.name}
          </span>
          {/* Readable Role Badge */}
          {employee.role && (
            <span className="text-[8.5px] font-semibold text-sky-300 bg-slate-900/95 px-1.5 py-0.5 rounded mt-0.5 uppercase border border-slate-700/60 whitespace-nowrap">
              {employee.role.split('/')[0].trim()}
            </span>
          )}'''
hc = hc.replace(old_badges, new_badges)

# Set initial rotation on group element
hc = hc.replace(
    '<group ref={groupRef} onClick={(e) => {',
    '<group ref={groupRef} rotation={[0, employee.rotation_y, 0]} onClick={(e) => {'
)

with open('frontend/src/components/office/HumanoidCharacter.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(hc)
print('HumanoidCharacter.tsx updated with 11px font sizes and rotation init!')
