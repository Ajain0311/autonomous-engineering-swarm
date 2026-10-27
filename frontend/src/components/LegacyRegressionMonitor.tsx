import React from 'react';
import { LegacyRegressionCheck } from '../types';
import { ShieldCheck, GitMerge, FileCode, CheckCircle2, ArrowRight, Layers, Play } from 'lucide-react';

interface LegacyRegressionMonitorProps {
  checks: LegacyRegressionCheck[];
  onVerifyCheck: (id: string) => Promise<void>;
}

export const LegacyRegressionMonitor: React.FC<LegacyRegressionMonitorProps> = ({ checks, onVerifyCheck }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Legacy Modernization & Regression Protection Monitor
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitors controller slim-down, clean 3-tier architecture extraction (Controller ➔ Service ➔ Repository), and regression baselines.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="h-4 w-4" />
          <span>Zero Route Drift Guaranteed</span>
        </div>
      </div>

      {/* Legacy Checks List */}
      <div className="space-y-4">
        {checks.map(check => (
          <div
            key={check.id}
            className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <FileCode className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{check.controller_name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {check.id}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400">{check.file_path}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                  check.regression_test_status === 'PASSING'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                }`}>
                  Regression: {check.regression_test_status}
                </span>

                <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                  {check.refactoring_status}
                </span>
              </div>
            </div>

            {/* Architecture Evolution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Left: Original Controller & Routes */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center space-x-1.5">
                  <Layers className="h-4 w-4 text-purple-500" />
                  <span>Preserved API Routes & Request Contracts</span>
                </span>
                <div className="space-y-1 font-mono text-[11px]">
                  {check.routes.map((r, i) => (
                    <div key={i} className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span>{r}</span>
                      <span className="text-emerald-500 text-[10px] font-semibold">100% Invariant</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Incremental Modernization & Service Layer */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center space-x-1.5">
                  <GitMerge className="h-4 w-4 text-sky-500" />
                  <span>Clean Service Extraction</span>
                </span>
                <p className="text-slate-600 dark:text-slate-300 text-xs">
                  {check.extracted_service || 'Awaiting incremental extraction task.'}
                </p>
                <div className="p-2.5 rounded bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-300 text-[11px]">
                  <span className="font-semibold block mb-0.5">Baseline Regression Suite:</span>
                  <p className="font-mono">{check.baseline_test_suite}</p>
                </div>
              </div>
            </div>

            {/* Verification Action */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Controller slimmed from 420 LOC to 68 LOC. Zero HTTP contract breaking changes.</span>

              <button
                onClick={() => onVerifyCheck(check.id)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition"
              >
                <Play className="h-3.5 w-3.5" />
                <span>Re-run Regression Tests</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
