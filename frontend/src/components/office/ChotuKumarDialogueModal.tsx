import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, X, Terminal, CheckCircle2, AlertTriangle, Activity, Cpu } from 'lucide-react';
import { OfficeEmployeeData, SpeechBubbleItem } from '../../types/office';
import { Task } from '../../types';
import { speechTts } from '../../utils/speechTts';
import { gameAudio } from '../../utils/gameAudio';

interface ChotuKumarDialogueModalProps {
  employee: OfficeEmployeeData | null;
  task: Task | null;
  latestSpeech: SpeechBubbleItem | null;
  allTasks: Task[];
  onClose: () => void;
}

export const ChotuKumarDialogueModal: React.FC<ChotuKumarDialogueModalProps> = ({
  employee,
  task,
  latestSpeech,
  allTasks,
  onClose,
}) => {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(speechTts.getMuted());

  if (!employee) return null;

  // Real live metrics from current tasks DAG
  const inProgressTasks = allTasks.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'TESTING');
  const underReviewTasks = allTasks.filter((t) => t.status === 'REVIEW');
  const verifiedTasks = allTasks.filter((t) => t.status === 'VERIFIED' || t.status === 'READY_TO_RELEASE');
  const failedTasks = allTasks.filter((t) => t.status === 'FAILED' || t.status === 'BLOCKED');

  // Build 100% REAL live response based on the employee's actual active work and system state
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
    const isAtRestroom = employee.current_coords[0] < -17 && employee.current_coords[2] > 13.5;

    // Question 0: "What are you working on right now?"
    if (qIndex === 0) {
      if (isAtSofa) {
        return `Haanji sir! Abhi thoda break leke lounge sofa pe betha hu. Jaise hi naya task assign hoga ya PR review aayega, main immediately desk pe code resume kar dunga!`;
      }
      if (isAtRestroom) {
        return `Sir, bas 1-2 minute me washroom se fresh hoke desk pe pahunch raha hu. All systems on track hain!`;
      }

      if (task) {
        let actionDesc = 'kaam kar raha hu';
        if (action === 'CODE') actionDesc = 'code implementation aur unit testing kar raha hu';
        if (action === 'TEST') actionDesc = 'QA staging test cases verify kar raha hu';
        if (action === 'DEFECT') actionDesc = 'test failure defect investigate and fix kar raha hu';
        if (action === 'PRESENT' || action === 'TALK') actionDesc = 'lead aur team ke saath review align kar raha hu';

        let speechAddon = '';
        if (latestSpeech && latestSpeech.text) {
          speechAddon = ` Mera latest live update hai: "${latestSpeech.text}".`;
        }

        return `Haanji sir! Main abhi live task ${task.id} - "${task.title}" par ${actionDesc}. Pipeline status "${task.status}" hai. Goal: ${task.goal}.${speechAddon}`;
      }

      // No active task currently assigned to this employee
      if (name.includes('Pooja')) {
        return `Namaste sir! Main reception lobby me live visitors aur gate operations coordinate kar rahi hu. System me total ${allTasks.length} tasks registered hain, jisme se ${inProgressTasks.length} active in-progress hain.`;
      }

      if (latestSpeech && latestSpeech.text) {
        return `Sir, mera latest live event hai: "${latestSpeech.text}". Current state "${status}" hai, total ${employee.tasks_completed} tasks completed hain.`;
      }

      return `Sir, currently main standby state me hu aur next task assignment ka wait kar raha hu. Maine abhi tak ${employee.tasks_completed} tasks successfully complete kiye hain.`;
    }

    // Question 1: "How is the project distribution & overall progress?"
    if (qIndex === 1) {
      if (allTasks.length === 0) {
        return `Boss, currently pipeline me koi tasks queue me nahi hain. Sabhi ${employee.department} units standby mode me hain.`;
      }

      const activeTaskNames = inProgressTasks.map((t) => t.id).slice(0, 3).join(', ');
      return `Haanji sir, live project distribution me total ${allTasks.length} tasks hain: ${inProgressTasks.length} tasks in-progress hain (${activeTaskNames || 'active'}), ${underReviewTasks.length} review me hain, aur ${verifiedTasks.length} successfully verified hain.`;
    }

    // Question 2: "Any blockers, defects, or reviews pending?"
    if (qIndex === 2) {
      if (failedTasks.length > 0) {
        const failedIds = failedTasks.map((t) => `${t.id}: ${t.title}`).join('; ');
        return `Sir, pipeline me ${failedTasks.length} failed defect tasks hain: ${failedIds}. Is par investigation chal rahi hai.`;
      }

      if (underReviewTasks.length > 0) {
        const reviewIds = underReviewTasks.map((t) => t.id).join(', ');
        return `Sir, currently ${underReviewTasks.length} tasks lead review queue me hain (${reviewIds}). Koi blocking failure nahi hai.`;
      }

      if (task && task.status === 'BLOCKED') {
        return `Sir, mera active task ${task.id} currently dependency wait me blocked hai. Approval milte hi aage badhunga.`;
      }

      return `Boss, live status check ekdam clear hai! Sabhi active tasks normal pass ho rahe hain aur koi blocking defect nahi hai.`;
    }

    return `Boss, all systems live running hain.`;
  };

  const currentLiveResponse = buildLiveResponse(selectedQuestionIndex);

  // Speak live response through speaker (Punjabi neural voice for Aditya)
  useEffect(() => {
    const isAditya = employee.id === 'agent-aditya' || employee.name.includes('Aditya');
    speechTts.speak(currentLiveResponse, { isPunjabi: isAditya });
  }, [currentLiveResponse, selectedQuestionIndex, employee.id]);

  const handleSelectQuestion = (idx: number) => {
    gameAudio.playClick();
    setSelectedQuestionIndex(idx);
  };

  const handleReplayVoice = () => {
    speechTts.speak(currentLiveResponse, { isPunjabi: employee.id === "agent-aditya" || employee.name.includes("Aditya") });
  };

  const handleToggleVoice = () => {
    const newMuted = !isVoiceMuted;
    speechTts.setMuted(newMuted);
    setIsVoiceMuted(newMuted);
    if (!newMuted) {
      speechTts.speak(currentLiveResponse, { isPunjabi: employee.id === "agent-aditya" || employee.name.includes("Aditya") });
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-end items-center p-4 sm:p-6 pb-8 bg-black/45 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="pointer-events-auto w-full max-w-2xl bg-gradient-to-b from-slate-900/98 via-slate-950/98 to-indigo-950/98 border-2 border-sky-400 rounded-3xl shadow-[0_0_50px_rgba(56,189,248,0.45)] p-5 text-white flex flex-col space-y-3.5">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-sky-500/30">
          <div className="flex items-center space-x-2.5">
            {/* Chotu Kumar Founder Badge */}
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.6)]">
              <span>👑</span>
              <span>CHOTU KUMAR (OWNER)</span>
            </div>
            <span className="text-sky-400 font-mono text-sm font-bold">↔</span>
            {/* Target Employee */}
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-bold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{employee.name}</span>
              <span className="text-slate-400 font-normal">({employee.role.split('/')[0].trim()})</span>
            </div>
          </div>

          {/* Audio & Close Controls */}
          <div className="flex items-center space-x-2">
            {/* Voice Model Switcher */}
            {speechTts.getAvailableVoices().length > 0 && (
              <select
                value={speechTts.getSelectedVoiceName() || ''}
                onChange={(e) => {
                  speechTts.setVoice(e.target.value);
                  speechTts.speak(currentLiveResponse, { isPunjabi: employee.id === "agent-aditya" || employee.name.includes("Aditya") });
                }}
                className="bg-slate-900 border border-slate-700 text-sky-300 text-[10px] font-mono rounded-lg px-2 py-1 max-w-[150px] truncate focus:outline-none focus:ring-1 focus:ring-sky-400"
                title="Select Hindi Voice Model"
              >
                {speechTts
                  .getAvailableVoices()
                  .filter(
                    (v) =>
                      v.lang.includes('hi') ||
                      v.lang.includes('en-IN') ||
                      v.name.includes('India') ||
                      v.name.includes('Hindi') ||
                      v.name.includes('Madhur') ||
                      v.name.includes('Swara') ||
                      v.lang.startsWith('en')
                  )
                  .map((v) => (
                    <option key={v.name} value={v.name}>
                      🎙️ {v.name.replace('Microsoft ', '').replace(' Online (Natural)', '').replace(' - Hindi (India)', '')}
                    </option>
                  ))}
              </select>
            )}

            <button
              onClick={handleReplayVoice}
              className="p-1.5 rounded-lg bg-sky-950 hover:bg-sky-800 text-sky-300 hover:text-white border border-sky-500/40 text-xs flex items-center space-x-1 transition active:scale-95"
              title="Hear response through speakers"
            >
              <Volume2 className="w-4 h-4 animate-pulse text-sky-400" />
              <span className="text-[11px] font-bold">Hear Voice</span>
            </button>
            <button
              onClick={handleToggleVoice}
              className={`p-1.5 rounded-lg border text-xs transition active:scale-95 ${
                isVoiceMuted
                  ? 'bg-rose-950/80 border-rose-500/60 text-rose-300'
                  : 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
              }`}
              title={isVoiceMuted ? 'Unmute Speaker' : 'Mute Speaker'}
            >
              {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition"
              title="Close [ESC]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Work Context Badge */}
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-sky-500/30 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 truncate">
            <Terminal className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-slate-400 font-bold">LIVE TASK:</span>
            <span className="font-bold text-white truncate">
              {task ? `${task.id} - ${task.title}` : `No Active Task (${employee.status})`}
            </span>
          </div>
          <div className="flex items-center space-x-1.5 shrink-0 ml-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-950 border border-emerald-500/40 text-emerald-300">
              {task ? task.status : employee.status}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-sky-950 border border-sky-500/40 text-sky-300">
              {employee.action}
            </span>
          </div>
        </div>

        {/* Chotu Kumar's Questions */}
        <div className="flex flex-col space-y-1">
          <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider">
            💬 Select Inquiry from Owner Chotu Kumar:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleSelectQuestion(0)}
              className={`p-2 rounded-xl text-xs font-semibold text-left transition border ${
                selectedQuestionIndex === 0
                  ? 'bg-sky-600/90 text-white border-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.4)] ring-1 ring-sky-300'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              1. "What are you working on right now?"
            </button>
            <button
              onClick={() => handleSelectQuestion(1)}
              className={`p-2 rounded-xl text-xs font-semibold text-left transition border ${
                selectedQuestionIndex === 1
                  ? 'bg-sky-600/90 text-white border-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.4)] ring-1 ring-sky-300'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              2. "How is project distribution & progress?"
            </button>
            <button
              onClick={() => handleSelectQuestion(2)}
              className={`p-2 rounded-xl text-xs font-semibold text-left transition border ${
                selectedQuestionIndex === 2
                  ? 'bg-sky-600/90 text-white border-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.4)] ring-1 ring-sky-300'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              3. "Any blockers, defects, or reviews pending?"
            </button>
          </div>
        </div>

        {/* Real Live Response (Spoken Out Loud via Speaker) */}
        <div className="bg-slate-900/95 rounded-2xl p-4 border border-sky-500/40 relative shadow-inner">
          <div className="flex items-center space-x-2 mb-2 text-xs font-mono font-bold text-sky-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{employee.name} reporting live:</span>
            {!isVoiceMuted && (
              <span className="ml-auto text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40 animate-pulse flex items-center space-x-1">
                <Volume2 className="w-3 h-3" />
                <span>SPEAKING VIA SPEAKER</span>
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-100 leading-relaxed italic">
            "{currentLiveResponse}"
          </p>
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>💡 Live work from orchestrator DAG • Press [ESC] to resume walking.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-sky-600 text-white font-bold transition active:scale-95 text-xs"
          >
            Done Talking [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
