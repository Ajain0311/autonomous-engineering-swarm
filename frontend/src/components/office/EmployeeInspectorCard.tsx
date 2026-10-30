import React from 'react';
import { X, ShieldCheck, Eye, Terminal, Edit3, Trash2, Zap, Award, CheckCircle2, MessageSquare } from 'lucide-react';
import { OfficeEmployeeData } from '../../types/office';
import { Task } from '../../types';
import { gameAudio } from '../../utils/gameAudio';

interface EmployeeInspectorCardProps {
  employee: OfficeEmployeeData | null;
  manager: OfficeEmployeeData | null;
  task: Task | null;
  onClose: () => void;
  onFollowEmployee: (emp: OfficeEmployeeData) => void;
  onInspectTask: (taskId: string) => void;
  isFollowing: boolean;
  onOpenEdit: (emp: OfficeEmployeeData) => void;
  onDeleteEmployee: (empId: string) => void;
  onTalkToEmployee?: (emp: OfficeEmployeeData) => void;
}

export const EmployeeInspectorCard: React.FC<EmployeeInspectorCardProps> = ({
  employee,
  manager,
  task,
  onClose,
  onFollowEmployee,
  onInspectTask,
  isFollowing,
  onOpenEdit,
  onDeleteEmployee,
  onTalkToEmployee
}) => {
  if (!employee) return null;

  const isChief = employee.id === 'agent-aditya';
  const rpgLevel = Math.min(99, 5 + (employee.tasks_completed || 0) * 3);
  const productivity = Math.min(100, 92 + (employee.tasks_completed % 8));

  const handleDelete = () => {
    gameAudio.playAlert();
    if (isChief) {
      alert('Cannot decommission Chief Orchestrator (Aditya Jain)');
      return;
    }
    if (window.confirm(`Decommission unit ${employee.name} (${employee.role}) from office?`)) {
      onDeleteEmployee(employee.id);
    }
  };

  return (
    <div className="absolute bottom-5 left-64 w-96 max-w-[calc(100vw-18rem)] bg-slate-950/90 border border-sky-500/40 rounded-2xl shadow-[0_0_30px_rgba(2,132,199,0.3)] backdrop-blur-2xl p-4 text-slate-100 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300 font-sans">
      {/* Unit Card Header */}
      <div className="flex items-start justify-between pb-3 border-b border-sky-500/20">
        <div className="flex items-center space-x-3">
          <div
            className="relative w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-white shadow-xl text-lg border-2 border-sky-400"
            style={{ backgroundColor: employee.appearance.clothingColor }}
          >
            {employee.name.split(' ').map(n => n[0]).join('')}
            <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-black text-[9px] font-mono text-sky-400 border border-sky-400">
              L.{rpgLevel}
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-black text-sm text-white tracking-wide">{employee.name}</h3>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-mono font-black uppercase bg-sky-950/80 text-sky-300 border border-sky-500/30">
                {employee.department}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">{employee.role}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {/* Modify Unit */}
          <button
            onClick={() => {
              gameAudio.playClick();
              onOpenEdit(employee);
            }}
            className="text-slate-400 hover:text-sky-300 p-1.5 rounded-lg hover:bg-slate-900 transition"
            title="Edit Unit Name, Role, Supervisor"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Delete Unit */}
          {!isChief && (
            <button
              onClick={handleDelete}
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-900 transition"
              title="Decommission Unit"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              gameAudio.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RPG Unit Stats Grid */}
      <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-800 text-center font-mono">
        <div className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block">LEVEL</span>
          <span className="text-xs font-black text-amber-300">{rpgLevel}</span>
        </div>
        <div className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block">PRODUCTIVITY</span>
          <span className="text-xs font-black text-emerald-400">{productivity}%</span>
        </div>
        <div className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block">COMPLETED</span>
          <span className="text-xs font-black text-sky-400">{employee.tasks_completed || 0}</span>
        </div>
      </div>

      {/* Body details */}
      <div className="py-3 space-y-2.5 text-xs">
        {/* Reporting Supervisor */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-400 text-[11px]">SUPERVISOR:</span>
          </div>
          <span className="font-bold text-white text-[11px]">
            {isChief ? '👑 TOP AUTHORITY' : manager ? `${manager.name}` : 'Autonomous'}
          </span>
        </div>

        {/* AI Engine Model */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 text-[11px]">COGNITIVE CORE:</span>
          </div>
          <span className="font-mono text-sky-300 text-[11px] font-bold">
            {employee.model}
          </span>
        </div>

        {/* Active Task / Status */}
        {task ? (
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-sky-500/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-400 text-[10px] font-mono font-bold flex items-center space-x-1">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                <span>MISSION TASK</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-900 text-sky-300">
                {task.status}
              </span>
            </div>
            <p className="font-semibold text-white text-xs line-clamp-1">{task.title}</p>
            <button
              onClick={() => {
                gameAudio.playClick();
                onInspectTask(task.id);
              }}
              className="mt-2 w-full py-1 rounded-lg bg-sky-600/40 hover:bg-sky-600 text-sky-200 hover:text-white text-[11px] font-bold transition flex items-center justify-center space-x-1"
            >
              <span>Inspect Task Pipeline</span>
            </button>
          </div>
        ) : (
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center space-x-2 text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-slate-500" />
            <span className="text-[11px]">Standing by in {employee.department}</span>
          </div>
        )}
      </div>

      {/* Talk in Punjabi / Indian Voice Button */}
      {onTalkToEmployee && (
        <button
          onClick={() => {
            gameAudio.playClick();
            onTalkToEmployee(employee);
          }}
          className="w-full py-2 mb-2 rounded-xl text-xs font-mono font-black transition shadow-lg flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 shadow-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.6)] active:scale-95"
        >
          <MessageSquare className="w-4 h-4" />
          <span>TALK (PUNJABI / INDIAN VOICE)</span>
        </button>
      )}

      {/* Follow Camera Action Button */}
      <button
        onClick={() => {
          gameAudio.playWhoosh();
          onFollowEmployee(employee);
        }}
        className={`w-full py-2 rounded-xl text-xs font-mono font-black transition shadow-lg flex items-center justify-center space-x-2 ${
          isFollowing
            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
            : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/30 hover:shadow-[0_0_15px_#38bdf8]'
        }`}
      >
        <Eye className="w-4 h-4" />
        <span>{isFollowing ? 'RELEASE CAMERA LOCK' : 'SATELLITE FOLLOW CAMERA'}</span>
      </button>
    </div>
  );
};
