with open('frontend/src/components/office/OfficeScene.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = """      {/* Walking Controls Banner when in Walk Mode */}
      {isWalkMode ? (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none flex items-center space-x-3 bg-slate-950/90 backdrop-blur-xl px-5 py-2.5 rounded-2xl border-2 border-emerald-400/80 text-xs text-white font-mono font-bold shadow-[0_0_30px_rgba(16,185,129,0.4)] z-30 animate-pulse">
          <Footprints className="w-4 h-4 text-emerald-400" />
          <span>WALKING: W/A/S/D or Arrow Keys to move • [E] to talk • [ESC] to exit</span>
        </div>
      ) : (
        /* Helpful Navigation Hint (Center Bottom) */
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none hidden md:flex items-center space-x-3 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800/80 text-[11px] text-slate-400 font-medium shadow-lg z-10">
          <span>👆 Orbit: Left-Click</span>
          <span className="text-slate-600">•</span>
          <span>✌️ Pan: Right-Click</span>
          <span className="text-slate-600">•</span>
          <span>🔍 Zoom: Scroll</span>
          <span className="text-slate-600">•</span>
          <span>⌨️ Tour Units: [ / ] or ◄ / ►</span>
        </div>
      )}"""

replacement = """      {/* Walking Controls Banner & Virtual Touch / Mouse D-Pad when in Walk Mode */}
      {isWalkMode ? (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center gap-2 z-30">
          <div className="flex items-center space-x-3 bg-slate-950/95 backdrop-blur-xl px-4 py-1.5 rounded-2xl border-2 border-emerald-400 text-xs text-white font-mono font-bold shadow-[0_0_25px_rgba(16,185,129,0.4)]">
            <Footprints className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>WALK MODE: W/A/S/D or Arrows to move • [E] to talk • [ESC] to exit</span>
            {onToggleWalkMode && (
              <button
                onClick={onToggleWalkMode}
                className="ml-2 px-2 py-0.5 bg-slate-800 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg text-[10px] transition font-bold"
              >
                Exit [ESC]
              </button>
            )}
          </div>

          {/* Virtual On-Screen Walking Pad */}
          <div className="flex items-center space-x-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-2xl">
            <button
              onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', code: 'KeyA' }))}
              onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', code: 'KeyA' }))}
              onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', code: 'KeyA' }))}
              onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', code: 'KeyA' }))}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 active:bg-emerald-500 text-slate-200 hover:text-white font-bold text-xs select-none"
              title="Turn Left"
            >
              ◄ Left
            </button>
            <button
              onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w', code: 'KeyW' }))}
              onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w', code: 'KeyW' }))}
              onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w', code: 'KeyW' }))}
              onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w', code: 'KeyW' }))}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs shadow-[0_0_15px_rgba(16,185,129,0.5)] select-none"
              title="Step Forward"
            >
              ▲ Walk In (W)
            </button>
            <button
              onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', code: 'KeyS' }))}
              onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 's', code: 'KeyS' }))}
              onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', code: 'KeyS' }))}
              onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 's', code: 'KeyS' }))}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 active:bg-emerald-500 text-slate-200 hover:text-white font-bold text-xs select-none"
              title="Step Back"
            >
              ▼ Back
            </button>
            <button
              onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd', code: 'KeyD' }))}
              onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'd', code: 'KeyD' }))}
              onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd', code: 'KeyD' }))}
              onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'd', code: 'KeyD' }))}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 active:bg-emerald-500 text-slate-200 hover:text-white font-bold text-xs select-none"
              title="Turn Right"
            >
              Right ►
            </button>
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', code: 'KeyE' }))}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow select-none"
              title="Interact / Talk"
            >
              💬 Talk [E]
            </button>
          </div>
        </div>
      ) : (
        /* Helpful Navigation Hint (Center Bottom) + Walk In Button */
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center space-x-3 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-sky-500/40 text-[11px] text-slate-200 font-medium shadow-2xl z-10">
          <button
            onClick={onToggleWalkMode}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)] transition active:scale-95"
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>ENTER & WALK IN</span>
          </button>
          <span className="text-slate-600">•</span>
          <span>👆 Orbit: Left-Click</span>
          <span className="text-slate-600">•</span>
          <span>✌️ Pan: Right-Click</span>
          <span className="text-slate-600">•</span>
          <span>🔍 Zoom: Scroll</span>
          <span className="text-slate-600">•</span>
          <span>⌨️ Tour Units: [ / ] or ◄ / ►</span>
        </div>
      )}"""

if target in text:
    text = text.replace(target, replacement, 1)
    with open('frontend/src/components/office/OfficeScene.tsx', 'w', encoding='utf-8', newline='\n') as f:
        f.write(text)
    print('Updated OfficeScene controls successfully')
else:
    print('Target not found')
