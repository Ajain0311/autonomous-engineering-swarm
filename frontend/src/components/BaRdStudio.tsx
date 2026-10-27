import React, { useState } from 'react';
import { BaDiscussion, RdSuggestion } from '../types';
import { HelpCircle, CheckCircle2, Lightbulb, ShieldAlert, Sparkles, Check, X, Send } from 'lucide-react';

interface BaRdStudioProps {
  discussions: BaDiscussion[];
  suggestions: RdSuggestion[];
  onAnswerQuestion: (discId: string, qId: string, answer: string) => Promise<void>;
  onConfirmBa: (discId: string) => Promise<void>;
  onApproveRd: (id: string) => Promise<void>;
  onDismissRd: (id: string) => Promise<void>;
}

export const BaRdStudio: React.FC<BaRdStudioProps> = ({
  discussions,
  suggestions,
  onAnswerQuestion,
  onConfirmBa,
  onApproveRd,
  onDismissRd
}) => {
  const [activeTab, setActiveTab] = useState<'ba' | 'rd'>('ba');
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});

  const handleCustomAnswerChange = (qId: string, val: string) => {
    setCustomAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSaveAnswer = async (discId: string, qId: string, defaultAnswer: string) => {
    const answer = customAnswers[qId] || defaultAnswer;
    await onAnswerQuestion(discId, qId, answer);
  };

  return (
    <div className="space-y-6">
      {/* Header with Sub-tabs */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Requirements Discussion & Thought / R&D Studio
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Collaborative alignment: BA clarifies business decisions before implementation; R&D proposes value-add enhancements.
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('ba')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'ba'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            BA Requirement Questions ({discussions.length})
          </button>
          <button
            onClick={() => setActiveTab('rd')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'rd'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            R&D Suggestions ({suggestions.length})
          </button>
        </div>
      </div>

      {/* 1. BA Discussion View */}
      {activeTab === 'ba' && (
        <div className="space-y-6">
          {discussions.map(disc => (
            <div
              key={disc.id}
              className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
            >
              {/* Feature Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded">
                      {disc.id}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{disc.feature_name}</h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Identified Problem: </span>
                    {disc.user_problem}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${
                    disc.status === 'CONFIRMED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 animate-pulse'
                  }`}
                >
                  {disc.status === 'CONFIRMED' ? 'Confirmed by Operator' : 'Awaiting Confirmation'}
                </span>
              </div>

              {/* Proposed Feature Flow */}
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                  Proposed Flow & Navigation
                </span>
                <p className="text-slate-600 dark:text-slate-400">{disc.proposed_flow}</p>
              </div>

              {/* Questions Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <HelpCircle className="h-4 w-4 text-sky-500" />
                  <span>Focused Business Decision Questions</span>
                </h4>

                <div className="space-y-3">
                  {disc.questions.map(q => (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-bold text-sky-600 dark:text-sky-400">{q.id}: {q.topic}</span>
                          <p className="text-slate-900 dark:text-white font-medium mt-0.5">{q.question}</p>
                        </div>
                        {q.is_answered && (
                          <span className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Decision Recorded</span>
                          </span>
                        )}
                      </div>

                      {/* Recommended Default Box */}
                      <div className="p-2.5 rounded bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40">
                        <span className="font-semibold text-sky-900 dark:text-sky-300">
                          Recommended Default: {q.recommended_default}
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Rationale: {q.rationale}
                        </p>
                      </div>

                      {/* Interactive Answer Control */}
                      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={customAnswers[q.id] !== undefined ? customAnswers[q.id] : (q.user_answer || '')}
                          onChange={(e) => handleCustomAnswerChange(q.id, e.target.value)}
                          placeholder={`Confirm or customize answer (Default: ${q.recommended_default})`}
                          className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                        <button
                          onClick={() => handleSaveAnswer(disc.id, q.id, q.recommended_default)}
                          className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs whitespace-nowrap shadow-sm transition"
                        >
                          Save Decision
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acceptance Criteria */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Agreed Acceptance Criteria
                </h4>
                <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  {disc.acceptance_criteria.map((ac, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                      <span>{ac}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Confirmation Gate Button */}
              {disc.status === 'PENDING_CONFIRMATION' && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => onConfirmBa(disc.id)}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition"
                  >
                    <Check className="h-4 w-4" />
                    <span>Confirm Requirements & Proceed to Implementation</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 2. Thought / R&D Suggestions View */}
      {activeTab === 'rd' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map(sugg => (
              <div
                key={sugg.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        sugg.category === 'ESSENTIAL'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      }`}>
                        {sugg.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{sugg.id}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      sugg.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                        : sugg.status === 'DISMISSED'
                        ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                    }`}>
                      {sugg.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                    {sugg.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Feature: {sugg.feature_name}</p>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="p-2.5 rounded bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300 block mb-0.5">Value & Benefit:</span>
                      <p className="text-slate-700 dark:text-slate-300">{sugg.benefit}</p>
                    </div>

                    <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-600 dark:text-slate-400 block mb-0.5">Risk & Trade-off:</span>
                      <p className="text-slate-600 dark:text-slate-300">{sugg.risk_tradeoff}</p>
                    </div>
                  </div>
                </div>

                {/* Status / Decision Controls */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Complexity: <span className="font-semibold text-slate-700 dark:text-slate-300">{sugg.complexity}</span></span>

                  {sugg.status === 'PROPOSED' ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onDismissRd(sugg.id)}
                        className="px-2.5 py-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded border border-slate-200 dark:border-slate-700 text-xs"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => onApproveRd(sugg.id)}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium text-xs shadow-sm transition"
                      >
                        Approve Scope
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Scope finalized</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
