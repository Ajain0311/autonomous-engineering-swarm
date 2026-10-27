import React, { useState } from 'react';
import {
  Play,
  Pause,
  Zap,
  Activity,
  UserPlus,
  Volume2,
  VolumeX,
  Radio,
  Flame,
  Footprints,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { CameraPreset } from '../../types/office';
import { gameAudio } from '../../utils/gameAudio';

interface OfficeControlsProps {
  currentCameraPreset: CameraPreset;
  onSelectCameraPreset: (preset: CameraPreset) => void;
  speedMultiplier: number;
  onChangeSpeed: (speed: number) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  onRunLifecycleScenario: () => void;
  isScenarioRunning: boolean;
  currentStep: number | null;
  selectedDepartment: string;
  onSelectDepartment: (dept: string) => void;
  performanceMode: boolean;
  onTogglePerformanceMode: () => void;
  activeFollowName?: string | null;
  onOpenAddEmployee: () => void;
  // Unit Navigation & Walk Mode
  isWalkMode: boolean;
  onToggleWalkMode: () => void;
  onNextEmployee: () => void;
  onPrevEmployee: () => void;
  selectedEmployeeName?: string;
  selectedEmployeeIndex: number;
  totalEmployees: number;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const OfficeControls: React.FC<OfficeControlsProps> = ({
  currentCameraPreset,
  onSelectCameraPreset,
  speedMultiplier,
  onChangeSpeed,
  isPaused,
  onTogglePause,
  onRunLifecycleScenario,
  isScenarioRunning,
  currentStep,
  selectedDepartment,
  onSelectDepartment,
  performanceMode,
  onTogglePerformanceMode,
  activeFollowName,
  onOpenAddEmployee,
  isWalkMode,
  onToggleWalkMode,
  onNextEmployee,
  onPrevEmployee,
  selectedEmployeeName,
  selectedEmployeeIndex,
  totalEmployees,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  const toggleSound = () => {
    gameAudio.isMuted = !gameAudio.isMuted;
    setIsAudioMuted(gameAudio.isMuted);
    if (!gameAudio.isMuted) gameAudio.playClick();
  };

  const cameraPresets: { id: CameraPreset; label: string; icon: string; key: string }[] = [
    { id: 'overview', label: 'Overview', icon: '🏢', key: '1' },
    { id: 'top_down', label: 'Tactical 2D', icon: '📐', key: '2' },
    { id: 'aditya_cabin', label: 'Executive', icon: '👑', key: '3' },
    { id: 'giriraj_cabin', label: 'Lead Cabin', icon: '⚡', key: '4' },
    { id: 'dev_pod', label: 'Dev Pod', icon: '💻', key: '5' },
    { id: 'qa_lab', label: 'QA Lab', icon: '🧪', key: '6' },
    { id: 'devops', label: 'DevOps', icon: '☁️', key: '7' },
    { id: 'ba_lounge', label: 'BA Lounge', icon: '📊', key: '8' },
  ];

  const departments = [
    'All Teams',
    'Executive',
    'Core Engineering',
    'Quality Assurance',
    'DevOps & Cloud',
    'Product & Design'
  ];

  return (
    <div className="absolute top-3 left-3 right-3 flex flex-col md:flex-row items-center justify-between pointer-events-none gap-2 z-30 font-sans">
      {/* Left: Mission Execution + Unit Tour Carousel + Walk Mode */}
      <div className="pointer-events-auto flex items-center space-x-1.5 bg-slate-950/85 backdrop-blur-xl p-1.5 rounded-2xl border border-sky-500/30 shadow-[0_0_20px_rgba(2,132,199,0.2)]">
        {/* Walk-in Character Mode Toggle */}
        <button
          onClick={() => {
            gameAudio.playClick();
            onToggleWalkMode();
          }}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-mono font-black transition-all shadow active:scale-95 border ${
            isWalkMode
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-300 shadow-[0_0_15px_#10b981] animate-pulse'
              : 'bg-slate-900 hover:bg-slate-800 text-sky-300 border-sky-500/40 hover:border-sky-400'
          }`}
          title="Walk inside office in 3rd-person avatar using WASD / Arrow keys"
        >
          <Footprints className="w-4 h-4 text-emerald-400" />
          <span>{isWalkMode ? 'WALKING IN OFFICE (WASD)' : 'ENTER OFFICE (WALK)'}</span>
        </button>

        {/* 18 Units Tour Navigation Carousel */}
        <div className="flex items-center space-x-1 px-1 py-0.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <button
            onClick={() => {
              gameAudio.playSelect();
              onPrevEmployee();
            }}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Previous Unit (Navigation key: [ or Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="px-2 py-0.5 text-[11px] font-mono font-bold text-center min-w-[130px]">
            <span className="text-sky-400 block text-[9px] uppercase tracking-wider">
              UNIT {selectedEmployeeIndex + 1}/{totalEmployees}
            </span>
            <span className="text-white truncate block max-w-[130px]">
              {selectedEmployeeName || 'Select Unit'}
            </span>
          </div>

          <button
            onClick={() => {
              gameAudio.playSelect();
              onNextEmployee();
            }}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Next Unit (Navigation key: ] or Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mission Trigger Button */}
        <button
          onClick={() => {
            gameAudio.playSuccess();
            onRunLifecycleScenario();
          }}
          disabled={isScenarioRunning}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all shadow active:scale-95 font-mono ${
            isScenarioRunning
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white animate-pulse border border-amber-300/50'
              : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white border border-sky-400/40'
          }`}
          title="Run 12-Step Real Office Lifecycle (Aditya -> Giriraj -> Rohan -> QA -> DevOps)"
        >
          {isScenarioRunning ? (
            <Activity className="w-4 h-4 animate-spin text-amber-200" />
          ) : (
            <Flame className="w-4 h-4 fill-amber-300 text-amber-400" />
          )}
          <span className="hidden sm:inline">
            {isScenarioRunning ? `STEP ${currentStep || 1}/12` : 'MISSION'}
          </span>
        </button>

        {/* Recruit Unit Button */}
        <button
          onClick={() => {
            gameAudio.playClick();
            onOpenAddEmployee();
          }}
          className="p-2 rounded-xl text-xs font-extrabold bg-emerald-600/90 hover:bg-emerald-500 text-white transition shadow border border-emerald-400/50 active:scale-95"
          title="Recruit new AI employee unit"
        >
          <UserPlus className="w-4 h-4" />
        </button>

        {/* Time Speed Controls */}
        <div className="flex items-center space-x-1 pl-1 border-l border-slate-800">
          <button
            onClick={() => {
              gameAudio.playClick();
              onTogglePause();
            }}
            className={`p-1.5 rounded-lg text-xs font-medium transition ${
              isPaused
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title={isPaused ? 'Resume Simulation' : 'Pause Simulation'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Center: Tactical Camera Feeds */}
      <div className="pointer-events-auto flex items-center space-x-1 bg-slate-950/85 backdrop-blur-xl p-1.5 rounded-2xl border border-sky-500/30 shadow-[0_0_20px_rgba(2,132,199,0.2)] overflow-x-auto max-w-full">
        {cameraPresets.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              gameAudio.playWhoosh();
              onSelectCameraPreset(p.id);
            }}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 font-mono ${
              currentCameraPreset === p.id && !isWalkMode
                ? 'bg-sky-600 text-white shadow-[0_0_12px_#38bdf8] border border-sky-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title={`Camera preset: ${p.label} (Key: ${p.key})`}
          >
            <span>{p.icon}</span>
            <span className="hidden lg:inline">{p.label}</span>
          </button>
        ))}

        {/* Following indicator pill */}
        {activeFollowName && !isWalkMode && (
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-indigo-950/80 border border-indigo-400/60 text-indigo-300">
            <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
            <span>LOCK: {activeFollowName.split(' ')[0]}</span>
          </div>
        )}
      </div>

      {/* Right: Squad Filter, SFX Toggle & Fidelity */}
      <div className="pointer-events-auto flex items-center space-x-1.5 bg-slate-950/85 backdrop-blur-xl p-1.5 rounded-2xl border border-sky-500/30 shadow-[0_0_20px_rgba(2,132,199,0.2)]">
        {/* Squad Selection Dropdown */}
        <select
          value={selectedDepartment}
          onChange={(e) => {
            gameAudio.playClick();
            onSelectDepartment(e.target.value);
          }}
          className="bg-slate-900 text-slate-200 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-sky-400"
        >
          {departments.map((d) => (
            <option key={d} value={d}>
              {d.toUpperCase()}
            </option>
          ))}
        </select>

        {/* SFX Audio Toggle */}
        <button
          onClick={toggleSound}
          className={`p-2 rounded-xl text-xs font-medium border transition ${
            isAudioMuted
              ? 'bg-slate-900 text-slate-500 border-slate-800'
              : 'bg-indigo-950 text-indigo-300 border-indigo-500/50 shadow-[0_0_8px_#818cf8]'
          }`}
          title={isAudioMuted ? 'Unmute Game SFX' : 'Mute Game SFX'}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
        </button>

        {/* High Fidelity / Low FX Toggle */}
        <button
          onClick={() => {
            gameAudio.playClick();
            onTogglePerformanceMode();
          }}
          className={`p-2 rounded-xl text-xs font-medium border transition ${
            performanceMode
              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
          title={performanceMode ? 'Performance Mode (Low FX)' : 'High Graphics'}
        >
          <Zap className="w-4 h-4 text-amber-400" />
        </button>

        {/* Fullscreen Mode Button */}
        {onToggleFullscreen && (
          <button
            onClick={() => {
              gameAudio.playClick();
              onToggleFullscreen();
            }}
            className={`p-2 rounded-xl text-xs font-medium border transition ${
              isFullscreen
                ? 'bg-sky-600 text-white border-sky-400 shadow-[0_0_12px_#38bdf8]'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Simulation'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4 text-sky-400" />}
          </button>
        )}
      </div>
    </div>
  );
};
