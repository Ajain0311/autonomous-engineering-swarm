import React from 'react';
import { Bot, Moon, Sun, ShieldAlert, PlayCircle, RefreshCw } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  killSwitchActive: boolean;
  onToggleKillSwitch: () => void;
  onRunDemoLoop: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  killSwitchActive,
  onToggleKillSwitch,
  onRunDemoLoop,
  activeTab,
  setActiveTab
}) => {
  const navTabs = [
    { id: 'hierarchy', label: 'Agent Hierarchy (18 Roles)' },
    { id: 'ba_rd', label: 'BA & R&D Studio' },
    { id: 'uiux', label: 'UI/UX Design & States' },
    { id: 'legacy', label: 'Legacy Modernization' },
    { id: 'assignments', label: 'Task Assignments (Who -> Whom)' },
    { id: 'kanban', label: 'Kanban Board' },
    { id: 'github', label: 'GitHub & CI/CD' },
    { id: 'vms', label: 'VM Fleet' },
    { id: 'approvals', label: 'Approval Center' },
  ];

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Swarm Orchestrator</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 font-semibold border border-emerald-500/20">17 Agents Live</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Autonomous Engineering Swarm</p>
            </div>
          </div>

          {/* Quick Actions & Controls */}
          <div className="flex items-center space-x-3">
            {/* Run Demo Recovery Loop */}
            <button
              onClick={onRunDemoLoop}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 transition shadow-sm"
              title="Demonstrate Defect Detection, Classification & Recovery Loop"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Simulate Defect & Recovery</span>
            </button>

            {/* Emergency Kill Switch */}
            <button
              onClick={onToggleKillSwitch}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition shadow-sm border ${
                killSwitchActive
                  ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                  : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900'
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              <span>{killSwitchActive ? 'HALTED (Kill Switch ON)' : 'Kill Switch'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800/60 scrollbar-none">
          {navTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
