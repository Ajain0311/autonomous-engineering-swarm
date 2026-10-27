import React, { useState } from 'react';
import { Cpu, ListOrdered, TestTube, AlertTriangle, Cloud, Server, CheckCircle2, Send, Play } from 'lucide-react';
import { SystemMetrics } from '../types';

interface ExecutionMonitorProps {
  metrics: SystemMetrics | null;
  onSubmitPrompt: (prompt: string) => Promise<void>;
}

export const ExecutionMonitor: React.FC<ExecutionMonitorProps> = ({ metrics, onSubmitPrompt }) => {
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmitPrompt(prompt);
      setPrompt('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeWorkers = metrics?.active_workers ?? 0;
  const maxWorkers = metrics?.max_workers ?? 8;
  const verifiedPct = metrics?.verified_criteria_percent ?? 0;

  return (
    <div className="space-y-4">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Active Coding Workers (Strict 8 Max) */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Coding Workers</span>
            <Cpu className="h-4 w-4 text-sky-500" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{activeWorkers}</span>
            <span className="text-xs text-slate-400">/ {maxWorkers} Max</span>
          </div>
          {/* Visual Concurrency Meter */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden flex">
            {Array.from({ length: maxWorkers }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 mx-0.5 rounded-full transition-colors ${
                  i < activeWorkers ? 'bg-sky-500' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Queue Length */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Ready Queue</span>
            <ListOrdered className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {metrics?.queue_length ?? 0}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Pending DAG dispatch</p>
        </div>

        {/* Running Tests */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Active Tests</span>
            <TestTube className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {metrics?.running_tests ?? 0}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">QA journey verification</p>
        </div>

        {/* CI Failures */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>CI Watcher Alerts</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {metrics?.ci_failures ?? 0}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Auto-routed for retry</p>
        </div>

        {/* Deployments */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Deployments</span>
            <Cloud className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {metrics?.active_deployments ?? 0}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Staging / Rollouts</p>
        </div>

        {/* Healthy VMs */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>VM Fleet</span>
            <Server className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {metrics?.healthy_vms ?? 5}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Inventory active</p>
        </div>

        {/* Verified Acceptance Criteria */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Verified Progress</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {verifiedPct}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${verifiedPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Autonomous Instruction Input Box */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Assign instruction to Swarm (e.g., 'Implement OAuth2 Google login with session revocation and test suite')..."
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !prompt.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-medium text-sm transition shadow-sm"
          >
            {isSubmitting ? (
              <span>Planning Swarm...</span>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Dispatch to Swarm</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
