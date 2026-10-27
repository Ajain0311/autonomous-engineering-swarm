import React from 'react';
import { Agent } from '../types';
import { X, Bot, Activity, CheckCircle, AlertCircle, Terminal } from 'lucide-react';

interface AgentDetailModalProps {
  agent: Agent | null;
  onClose: () => void;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({ agent, onClose }) => {
  if (!agent) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-base">
              {agent.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{agent.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{agent.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">Status</span>
              <span className="font-bold text-slate-900 dark:text-white">{agent.status}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">Model</span>
              <span className="font-bold text-slate-900 dark:text-white">{agent.model}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">Completed Tasks</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{agent.tasks_completed}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">Failed Tasks</span>
              <span className="font-bold text-rose-500">{agent.tasks_failed}</span>
            </div>
          </div>

          {/* Current Assignment */}
          <div className="p-3.5 rounded-xl border border-sky-100 dark:border-sky-900/40 bg-sky-50/50 dark:bg-sky-950/20">
            <h4 className="font-bold text-sky-900 dark:text-sky-300 mb-1">Active Task</h4>
            <p className="text-slate-700 dark:text-slate-300">
              {agent.current_task_id ? `Currently leased: ${agent.current_task_id}` : 'Idle — No active lease.'}
            </p>
          </div>

          {/* Activity Logs & Decisions */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center space-x-1.5">
              <Terminal className="h-4 w-4 text-slate-400" />
              <span>Activity & Decision Logs</span>
            </h4>
            <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] max-h-48 overflow-y-auto space-y-1 border border-slate-800">
              {agent.logs && agent.logs.length > 0 ? (
                agent.logs.map((log, i) => <div key={i} className="leading-relaxed">&gt; {log}</div>)
              ) : (
                <div className="text-slate-500 italic">No recent logs recorded.</div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
