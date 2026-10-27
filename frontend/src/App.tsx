import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ExecutionMonitor } from './components/ExecutionMonitor';
import { AgentHierarchy } from './components/AgentHierarchy';
import { TaskAssignmentGraph } from './components/TaskAssignmentGraph';
import { KanbanBoard } from './components/KanbanBoard';
import { GitHubMonitor } from './components/GitHubMonitor';
import { VmFleetDashboard } from './components/VmFleetDashboard';
import { ApprovalCenter } from './components/ApprovalCenter';
import { BaRdStudio } from './components/BaRdStudio';
import { UiUxDesignStudio } from './components/UiUxDesignStudio';
import { LegacyRegressionMonitor } from './components/LegacyRegressionMonitor';
import { AgentDetailModal } from './components/AgentDetailModal';
import { TaskDetailModal } from './components/TaskDetailModal';

import { api } from './services/api';
import { wsClient } from './services/websocket';
import {
  Agent,
  Task,
  TaskGraphData,
  SystemMetrics,
  WorkflowRun,
  VmNode,
  Approval,
  BaDiscussion,
  RdSuggestion,
  UiUxDesignSpec,
  LegacyRegressionCheck
} from './types';

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('hierarchy');

  // Core Data State
  const [agents, setAgents] = useState<Agent[]>([]);
  const [taskGraph, setTaskGraph] = useState<TaskGraphData | null>(null);
  const [kanbanData, setKanbanData] = useState<Record<string, Task[]> | null>(null);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([]);
  const [vmNodes, setVmNodes] = useState<VmNode[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);

  // Modernization & Extended Features State
  const [baDiscussions, setBaDiscussions] = useState<BaDiscussion[]>([]);
  const [rdSuggestions, setRdSuggestions] = useState<RdSuggestion[]>([]);
  const [uiuxSpecs, setUiUxSpecs] = useState<UiUxDesignSpec[]>([]);
  const [legacyChecks, setLegacyChecks] = useState<LegacyRegressionCheck[]>([]);

  // Selection Modals
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Initial Data Fetch
  const loadAllData = async () => {
    try {
      const [
        agentsData,
        graphData,
        kanban,
        mData,
        runs,
        vms,
        apprs,
        baData,
        rdData,
        uiuxData,
        legData
      ] = await Promise.all([
        api.getAgents(),
        api.getTaskGraph(),
        api.getKanban(),
        api.getMetrics(),
        api.getWorkflowRuns(),
        api.getVmNodes(),
        api.getApprovals(),
        api.getBaDiscussions(),
        api.getRdSuggestions(),
        api.getUiUxSpecs(),
        api.getLegacyChecks(),
      ]);
      setAgents(agentsData);
      setTaskGraph(graphData);
      setKanbanData(kanban);
      setMetrics(mData);
      setWorkflowRuns(runs);
      setVmNodes(vms);
      setApprovals(apprs);
      setBaDiscussions(baData);
      setRdSuggestions(rdData);
      setUiUxSpecs(uiuxData);
      setLegacyChecks(legData);
    } catch (e) {
      console.error('Failed to load swarm data', e);
    }
  };

  useEffect(() => {
    loadAllData();

    // WebSocket real-time subscription
    wsClient.connect();
    const unsubscribe = wsClient.subscribe(() => {
      loadAllData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Sync dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load specific task details if selected
  useEffect(() => {
    if (selectedTaskId) {
      api.getTasks().then((tasks) => {
        const found = tasks.find((t) => t.id === selectedTaskId);
        if (found) setSelectedTask(found);
      });
    } else {
      setSelectedTask(null);
    }
  }, [selectedTaskId]);

  const handleDispatchPrompt = async (prompt: string) => {
    await api.submitPrompt(prompt);
    await loadAllData();
  };

  const handleToggleKillSwitch = async () => {
    if (!metrics) return;
    const nextState = !metrics.kill_switch_active;
    await api.toggleKillSwitch(nextState);
    await loadAllData();
  };

  const handleRunDemoLoop = async () => {
    await api.runDemoFailureLoop();
    await loadAllData();
  };

  const handleApprove = async (id: string) => {
    await api.approveRequest(id);
    await loadAllData();
  };

  const handleReject = async (id: string, reason: string) => {
    await api.rejectRequest(id, reason);
    await loadAllData();
  };

  const handleSyncVm = async (id: string) => {
    await api.syncVm(id);
    await loadAllData();
  };

  const handleAnswerBaQuestion = async (discId: string, qId: string, answer: string) => {
    await api.answerBaQuestion(discId, qId, answer);
    await loadAllData();
  };

  const handleConfirmBa = async (discId: string) => {
    await api.confirmBaProposal(discId);
    await loadAllData();
  };

  const handleApproveRd = async (id: string) => {
    await api.approveRdSuggestion(id);
    await loadAllData();
  };

  const handleDismissRd = async (id: string) => {
    await api.dismissRdSuggestion(id);
    await loadAllData();
  };

  const handleVerifyLegacyCheck = async (id: string) => {
    await api.verifyLegacyRegression(id);
    await loadAllData();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        killSwitchActive={metrics?.kill_switch_active ?? false}
        onToggleKillSwitch={handleToggleKillSwitch}
        onRunDemoLoop={handleRunDemoLoop}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Live Execution Monitor */}
        <ExecutionMonitor metrics={metrics} onSubmitPrompt={handleDispatchPrompt} />

        {/* Tab Views */}
        {activeTab === 'hierarchy' && (
          <AgentHierarchy agents={agents} onSelectAgent={(agent) => setSelectedAgent(agent)} />
        )}

        {activeTab === 'ba_rd' && (
          <BaRdStudio
            discussions={baDiscussions}
            suggestions={rdSuggestions}
            onAnswerQuestion={handleAnswerBaQuestion}
            onConfirmBa={handleConfirmBa}
            onApproveRd={handleApproveRd}
            onDismissRd={handleDismissRd}
          />
        )}

        {activeTab === 'uiux' && (
          <UiUxDesignStudio specs={uiuxSpecs} />
        )}

        {activeTab === 'legacy' && (
          <LegacyRegressionMonitor
            checks={legacyChecks}
            onVerifyCheck={handleVerifyLegacyCheck}
          />
        )}

        {activeTab === 'assignments' && (
          <TaskAssignmentGraph
            data={taskGraph}
            onSelectTask={(taskId) => setSelectedTaskId(taskId)}
          />
        )}

        {activeTab === 'kanban' && (
          <KanbanBoard
            kanbanData={kanbanData}
            onSelectTask={(taskId) => setSelectedTaskId(taskId)}
          />
        )}

        {activeTab === 'github' && (
          <GitHubMonitor
            runs={workflowRuns}
            onSelectTask={(taskId) => setSelectedTaskId(taskId)}
          />
        )}

        {activeTab === 'vms' && (
          <VmFleetDashboard nodes={vmNodes} onSyncVm={handleSyncVm} />
        )}

        {activeTab === 'approvals' && (
          <ApprovalCenter
            approvals={approvals}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </main>

      {/* Modals */}
      <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      <TaskDetailModal
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onRetry={async () => {
          await api.getTasks();
          setSelectedTaskId(null);
          loadAllData();
        }}
      />
    </div>
  );
};

export default App;
