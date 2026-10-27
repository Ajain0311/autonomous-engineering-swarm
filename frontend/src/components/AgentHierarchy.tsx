import React from 'react';
import { User, Shield, Terminal, Activity, ArrowDown } from 'lucide-react';
import { Agent } from '../types';

interface AgentHierarchyProps {
  agents: Agent[];
  onSelectAgent: (agent: Agent) => void;
}

export const AgentHierarchy: React.FC<AgentHierarchyProps> = ({ agents, onSelectAgent }) => {
  // Group agents into tiers
  const orchestrator = agents.find(a => a.id === 'agent-orchestrator');
  const leadership = agents.filter(a => ['agent-pm', 'agent-ba', 'agent-rnd', 'agent-uiux', 'agent-architect'].includes(a.id));
  const seniors = agents.filter(a => ['agent-senior-1', 'agent-senior-2'].includes(a.id));
  const juniors = agents.filter(a => ['agent-junior-1', 'agent-junior-2', 'agent-junior-3', 'agent-dynamic-worker'].includes(a.id));
  const opsAndGates = agents.filter(a => ['agent-devops', 'agent-watcher', 'agent-qa', 'agent-vm-fleet', 'agent-assembly', 'agent-security'].includes(a.id));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-400 animate-pulse border border-amber-300 dark:border-amber-700">RUNNING</span>;
      case 'IDLE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">IDLE</span>;
      case 'BLOCKED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-400">BLOCKED</span>;
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400">COMPLETED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800">{status}</span>;
    }
  };

  const renderAgentCard = (agent: Agent, borderHighlight = 'border-slate-200 dark:border-slate-800') => (
    <div
      key={agent.id}
      onClick={() => onSelectAgent(agent)}
      className={`bg-white dark:bg-slate-900 rounded-xl p-3.5 border ${borderHighlight} shadow-sm hover:shadow-md hover:border-sky-500/50 cursor-pointer transition flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded-lg bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs">
              {agent.name.charAt(0)}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{agent.name}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{agent.role}</p>
            </div>
          </div>
          {getStatusBadge(agent.status)}
        </div>

        {agent.current_task_id ? (
          <div className="mt-2 text-[11px] p-2 rounded bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 text-sky-900 dark:text-sky-300">
            <span className="font-semibold">Current: </span>
            <span>{agent.current_task_id}</span>
          </div>
        ) : (
          <div className="mt-2 text-[11px] text-slate-400 italic">Standby / Awaiting task</div>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
        <span>Model: {agent.model}</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
          {agent.tasks_completed} done
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Hierarchy Header */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">18-Role Agent Hierarchy & Organization</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Live multi-agent coordination structure with dedicated UI/UX Design Engineer and dynamic worktree workers</p>
        </div>
        <div className="text-xs text-slate-400">Click any agent to inspect logs, tool activity & decisions</div>
      </div>

      {/* Tier 1: Chief Orchestrator */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md">
          {orchestrator && renderAgentCard(orchestrator, 'border-sky-500 shadow-sky-500/10')}
        </div>
        <ArrowDown className="h-5 w-5 text-slate-300 dark:text-slate-700 my-2" />
      </div>

      {/* Tier 2: Leadership / Architecture / PM / R&D */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
          Strategy, Product & Architectural Leadership
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {leadership.map(a => renderAgentCard(a))}
        </div>
      </div>

      <div className="flex justify-center">
        <ArrowDown className="h-5 w-5 text-slate-300 dark:text-slate-700" />
      </div>

      {/* Tier 3: Senior & Junior Implementation Specialists */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
          Implementation Specialists & Dynamic Coding Workers (Max 8 Concurrent)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {seniors.map(a => (
            <div key={a.id} className="lg:col-span-3">
              {renderAgentCard(a, 'border-indigo-300 dark:border-indigo-900/60')}
            </div>
          ))}
          {juniors.map(a => (
            <div key={a.id} className="lg:col-span-3">
              {renderAgentCard(a)}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <ArrowDown className="h-5 w-5 text-slate-300 dark:text-slate-700" />
      </div>

      {/* Tier 4: DevOps, QA, VM Fleet, Assembly & Security Gate */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
          DevOps, QA Simulation, Infrastructure Fleet, Assembly & Release Gate
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {opsAndGates.map(a => renderAgentCard(a, a.id === 'agent-security' ? 'border-amber-400 dark:border-amber-800' : ''))}
        </div>
      </div>
    </div>
  );
};
