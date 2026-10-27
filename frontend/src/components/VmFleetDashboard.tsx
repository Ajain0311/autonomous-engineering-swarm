import React from 'react';
import { VmNode } from '../types';
import { Server, RefreshCw, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface VmFleetDashboardProps {
  nodes: VmNode[];
  onSyncVm: (id: string) => Promise<void>;
}

export const VmFleetDashboard: React.FC<VmFleetDashboardProps> = ({ nodes, onSyncVm }) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">VM Fleet & Infrastructure Inventory</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Managed by VM Fleet Handler via repeatable configuration. Safe drift detection with zero secret exposure.
          </p>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <ShieldCheck className="h-4 w-4" />
          <span>Secret Redaction Active</span>
        </div>
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodes.map((node) => (
          <div
            key={node.id}
            className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                    <Server className="h-4 w-4 text-sky-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                      {node.alias}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">{node.host}</span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    node.environment === 'production'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                  }`}
                >
                  {node.environment}
                </span>
              </div>

              {/* Status and Version details */}
              <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className={`font-semibold ${
                    node.status === 'HEALTHY'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-500'
                  }`}>
                    {node.status}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Current Version:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{node.current_version}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Target Version:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{node.target_version}</span>
                </div>

                {node.drift_details && (
                  <div className="mt-3 p-2.5 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-300 text-[11px]">
                    <div className="flex items-center space-x-1 font-semibold mb-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      <span>Configuration Drift Detected</span>
                    </div>
                    <p className="font-mono text-[10px] break-all">{node.drift_details}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {node.is_simulated && (
                <span className="text-[10px] text-slate-400 italic">Simulated Node</span>
              )}
              <button
                onClick={() => onSyncVm(node.id)}
                className="ml-auto inline-flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Sync & Reconcile</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
