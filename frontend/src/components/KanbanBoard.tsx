import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { Filter, GitCommit, AlertCircle, RefreshCw } from 'lucide-react';

interface KanbanBoardProps {
  kanbanData: Record<string, Task[]> | null;
  onSelectTask: (taskId: string) => void;
}

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'PLANNED', label: 'Planned', color: 'border-slate-300 dark:border-slate-700' },
  { id: 'READY', label: 'Ready', color: 'border-sky-400 dark:border-sky-600' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'border-amber-400 dark:border-amber-600' },
  { id: 'REVIEW', label: 'Review', color: 'border-indigo-400 dark:border-indigo-600' },
  { id: 'TESTING', label: 'Testing', color: 'border-purple-400 dark:border-purple-600' },
  { id: 'BLOCKED', label: 'Blocked', color: 'border-rose-400 dark:border-rose-600' },
  { id: 'READY_TO_RELEASE', label: 'Ready to Release', color: 'border-cyan-400 dark:border-cyan-600' },
  { id: 'VERIFIED', label: 'Verified', color: 'border-emerald-400 dark:border-emerald-600' },
  { id: 'FAILED', label: 'Failed', color: 'border-red-500 dark:border-red-700' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ kanbanData, onSelectTask }) => {
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!kanbanData) return <div className="p-8 text-center text-slate-400">Loading Kanban board...</div>;

  return (
    <div className="space-y-4">
      {/* Controls / Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Filter:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search task title or ID..."
          className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-3 py-1.5 text-slate-800 dark:text-slate-200 w-full sm:w-64"
        />
      </div>

      {/* Kanban Board Columns Container */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
        {COLUMNS.map((col) => {
          const rawTasks = kanbanData[col.id] || [];
          const filteredTasks = rawTasks.filter((t) => {
            const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
            const matchesSearch =
              searchQuery.trim() === '' ||
              t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.id.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesPriority && matchesSearch;
          });

          return (
            <div
              key={col.id}
              className="w-72 flex-shrink-0 bg-slate-100/70 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-200 dark:border-slate-800/80 flex flex-col max-h-[750px]"
            >
              {/* Column Header */}
              <div className={`flex items-center justify-between pb-2 mb-2 border-b-2 ${col.color}`}>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {col.label}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredTasks.length}
                </span>
              </div>

              {/* Task Cards in Column */}
              <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task.id)}
                    className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700/80 hover:border-sky-500 dark:hover:border-sky-500 shadow-sm cursor-pointer transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] mb-1.5">
                        <span className="font-bold text-slate-900 dark:text-white">{task.id}</span>
                        <span
                          className={`font-semibold px-1.5 py-0.5 rounded ${
                            task.priority === 'HIGH'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2">
                        {task.title}
                      </h4>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      {task.commit_sha ? (
                        <span className="flex items-center space-x-1 font-mono text-emerald-600 dark:text-emerald-400">
                          <GitCommit className="h-3 w-3" />
                          <span>{task.commit_sha.slice(0, 6)}</span>
                        </span>
                      ) : (
                        <span>No commit</span>
                      )}

                      {task.retries > 0 && (
                        <span className="flex items-center space-x-1 text-amber-500 font-semibold">
                          <RefreshCw className="h-3 w-3" />
                          <span>Retry {task.retries}</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {filteredTasks.length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-400 italic">No tasks</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
