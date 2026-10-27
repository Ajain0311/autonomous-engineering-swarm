import React from 'react';
import { WorkflowRun } from '../types';
import { GitBranch, GitCommit, CheckCircle2, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';

interface GitHubMonitorProps {
  runs: WorkflowRun[];
  onSelectTask?: (taskId: string) => void;
}

export const GitHubMonitor: React.FC<GitHubMonitorProps> = ({ runs, onSelectTask }) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">GitHub Actions & CI/CD Sentinel</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitored by Automation Engineer & Actions Watcher. Failures classified and automatically routed.
          </p>
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          Webhook Sentinel Active
        </span>
      </div>

      {/* Runs Table / Cards */}
      <div className="space-y-3">
        {runs.map((run) => (
          <div
            key={run.id}
            className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-3">
                {run.conclusion === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{run.workflow_name}</h4>
                    {run.simulated && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                        SIMULATED CI
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="flex items-center space-x-1">
                      <GitBranch className="h-3.5 w-3.5 text-slate-400" />
                      <span>{run.branch}</span>
                    </span>
                    <span className="flex items-center space-x-1 font-mono text-[11px]">
                      <GitCommit className="h-3.5 w-3.5 text-slate-400" />
                      <span>{run.commit_sha.slice(0, 7)}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and Action Watcher Diagnosis */}
              <div className="flex items-center space-x-3">
                {run.failure_category && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Watcher Diagnosis: {run.failure_category}</span>
                  </span>
                )}

                {run.linked_task_id && onSelectTask && (
                  <button
                    onClick={() => onSelectTask(run.linked_task_id!)}
                    className="text-xs px-2.5 py-1 rounded bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-300 font-medium hover:underline flex items-center space-x-1"
                  >
                    <span>Linked: {run.linked_task_id}</span>
                  </button>
                )}
              </div>
            </div>

            {/* If failure log excerpt exists */}
            {run.log_excerpt && (
              <div className="mt-3 p-3 rounded-lg bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800">
                <div className="text-[10px] text-rose-400 uppercase font-bold tracking-wider mb-1">
                  Failed Step: {run.failed_step || 'Test Execution'}
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap">{run.log_excerpt}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
