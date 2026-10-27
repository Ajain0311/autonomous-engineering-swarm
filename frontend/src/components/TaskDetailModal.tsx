import React from 'react';
import { Task } from '../types';
import { X, CheckCircle2, GitCommit, FileText, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
  onRetry?: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onRetry }) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
              {task.id}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{task.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">Status</span>
              <span className="font-bold text-slate-900 dark:text-white">{task.status}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">Priority</span>
              <span className="font-bold text-slate-900 dark:text-white">{task.priority}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">Assigned Agent</span>
              <span className="font-bold text-slate-900 dark:text-white">{task.assigned_agent_id || 'Unassigned'}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">Retries</span>
              <span className="font-bold text-slate-900 dark:text-white">{task.retries} / {task.max_retries}</span>
            </div>
          </div>

          {/* Goal & Description */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Goal & Scope</h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{task.goal}</p>
          </div>

          {/* Acceptance Criteria */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Verifiable Acceptance Criteria</span>
            </h4>
            <ul className="space-y-1.5">
              {task.acceptance_criteria.map((c, i) => (
                <li key={i} className="flex items-start space-x-2 text-slate-700 dark:text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Allowed File Boundaries */}
          {task.allowed_files.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">Allowed File Boundaries</h4>
              <div className="flex flex-wrap gap-1.5">
                {task.allowed_files.map((f, i) => (
                  <span key={i} className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Commit & Test Verification Output */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <GitCommit className="h-4 w-4 text-sky-500" />
              <span>Verification Evidence</span>
            </h4>
            <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] space-y-1 border border-slate-800">
              <div>Commit SHA: {task.commit_sha || 'Pending verification'}</div>
              <div>Test Command: {task.test_command || 'None'}</div>
              <div>Test Status: {task.test_passed ? 'PASSED (0 Failures)' : 'Not Passed'}</div>
              {task.test_output && (
                <div className="mt-2 pt-2 border-t border-slate-800 text-slate-400">
                  {task.test_output}
                </div>
              )}
            </div>
          </div>

          {/* Error Message if Failed */}
          {task.error_message && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-300">
              <div className="flex items-center space-x-1.5 font-bold mb-1">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
                <span>Failure Details</span>
              </div>
              <p className="font-mono text-[11px]">{task.error_message}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {task.status === 'FAILED' && onRetry ? (
            <button
              onClick={() => onRetry(task.id)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-sm transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry Task</span>
            </button>
          ) : <div />}

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
