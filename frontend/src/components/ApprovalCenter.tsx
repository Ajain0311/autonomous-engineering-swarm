import React, { useState } from 'react';
import { Approval } from '../types';
import { ShieldCheck, Check, X, AlertOctagon, GitCommit, FileCheck } from 'lucide-react';

interface ApprovalCenterProps {
  approvals: Approval[];
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
}

export const ApprovalCenter: React.FC<ApprovalCenterProps> = ({ approvals, onApprove, onReject }) => {
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  const handleConfirmReject = async (id: string) => {
    if (!rejectReason.trim()) return;
    await onReject(id, rejectReason);
    setRejectId(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Human Approval Center</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Mandatory human signoff gate for production releases, destructive migrations, and critical infrastructure mutations.
          </p>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
          <ShieldCheck className="h-4 w-4" />
          <span>Strict Release Gate Enforced</span>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {approvals.map((appr) => (
          <div
            key={appr.id}
            className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded">
                    {appr.id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{appr.title}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Action: {appr.action_type}</p>
              </div>

              <span
                className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${
                  appr.status === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    : appr.status === 'REJECTED'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 animate-pulse'
                }`}
              >
                {appr.status}
              </span>
            </div>

            {/* Evidence, Risk & Rollback Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Commit & Artifact
                </span>
                <div className="flex items-center space-x-1 font-mono text-slate-800 dark:text-slate-200">
                  <GitCommit className="h-3.5 w-3.5 text-slate-400" />
                  <span>{appr.commit_sha || 'N/A'}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                <span className="font-semibold text-rose-600 dark:text-rose-400 block mb-1">
                  Risk Assessment
                </span>
                <p className="text-slate-700 dark:text-slate-300">{appr.risk_summary}</p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                  Rollback Procedure
                </span>
                <p className="text-slate-700 dark:text-slate-300">{appr.rollback_plan}</p>
              </div>
            </div>

            {appr.test_evidence && (
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 text-xs">
                <div className="flex items-center space-x-1 font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <FileCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Verified Test Evidence</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-mono text-[11px]">{appr.test_evidence}</p>
              </div>
            )}

            {/* Approval / Rejection Actions */}
            {appr.status === 'PENDING' && (
              <div className="pt-2 flex items-center justify-end space-x-3">
                {rejectId === appr.id ? (
                  <div className="flex items-center space-x-2 w-full max-w-md">
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Reason for rejection..."
                      className="text-xs px-3 py-1.5 rounded border border-rose-300 dark:border-rose-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex-1"
                    />
                    <button
                      onClick={() => handleConfirmReject(appr.id)}
                      className="px-3 py-1.5 rounded bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
                    >
                      Confirm Reject
                    </button>
                    <button
                      onClick={() => setRejectId(null)}
                      className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setRejectId(appr.id)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium transition"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => onApprove(appr.id)}
                      className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Authorize Production Release</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}

        {approvals.length === 0 && (
          <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            No pending approval requests. Swarm operations within autonomous boundary.
          </div>
        )}
      </div>
    </div>
  );
};
