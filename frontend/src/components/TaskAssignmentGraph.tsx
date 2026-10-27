import React from 'react';
import { ArrowRight, GitCommit, Clock, CheckCircle2, AlertCircle, UserCheck } from 'lucide-react';
import { TaskGraphData } from '../types';

interface TaskAssignmentGraphProps {
  data: TaskGraphData | null;
  onSelectTask: (taskId: string) => void;
}

export const TaskAssignmentGraph: React.FC<TaskAssignmentGraphProps> = ({ data, onSelectTask }) => {
  if (!data) return <div className="p-8 text-center text-slate-400">Loading task assignment graph...</div>;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Live Task Assignment Visualization</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Traceable mapping: Exactly WHO assigns WHAT to WHOM with dependency contracts</p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Verified</span>
          </span>
          <span className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>In Progress</span>
          </span>
          <span className="flex items-center space-x-1 text-sky-600 dark:text-sky-400">
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            <span>Ready</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: WHO assigns WHAT to WHOM Event Timeline */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-2">
            <UserCheck className="h-4 w-4 text-sky-500" />
            <span>Assignment Events (Who ➔ Whom)</span>
          </h3>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {data.assignment_events.map(event => (
              <div
                key={event.id}
                onClick={() => onSelectTask(event.task_id)}
                className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-sky-400 cursor-pointer transition text-xs"
              >
                <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white mb-1">
                  <span>{event.task_id}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                    {event.status}
                  </span>
                </div>

                {/* Who -> Whom flow */}
                <div className="flex items-center space-x-1.5 my-2 text-slate-600 dark:text-slate-300">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{event.from_agent}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-sky-500 flex-shrink-0" />
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">{event.to_agent}</span>
                </div>

                {event.rationale && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {event.rationale}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive DAG Node Flow */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-2">
              <GitCommit className="h-4 w-4 text-purple-500" />
              <span>Dependency Execution DAG</span>
            </h3>

            <div className="space-y-3">
              {data.nodes.map(node => (
                <div
                  key={node.id}
                  onClick={() => onSelectTask(node.id)}
                  className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-500 transition cursor-pointer bg-slate-50/30 dark:bg-slate-800/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800">
                        {node.id}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">{node.title}</h4>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      node.status === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                        : node.status === 'IN_PROGRESS'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 animate-pulse'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {node.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2.5">
                    <div>
                      <span>Owner: </span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{node.assigned_agent_name}</span>
                    </div>

                    {node.dependencies.length > 0 && (
                      <div>
                        <span>Requires: </span>
                        <span className="font-mono text-[10px] text-sky-600 dark:text-sky-400">
                          {node.dependencies.join(', ')}
                        </span>
                      </div>
                    )}

                    {node.commit_sha && (
                      <div className="flex items-center space-x-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                        <GitCommit className="h-3 w-3" />
                        <span>{node.commit_sha.slice(0, 8)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
