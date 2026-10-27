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
} from '../types';

const API_BASE = '/api';

export const api = {
  getProjects: async () => {
    const res = await fetch(`${API_BASE}/projects`);
    return res.json();
  },

  getAgents: async (): Promise<Agent[]> => {
    const res = await fetch(`${API_BASE}/agents`);
    return res.json();
  },

  getTasks: async (filters?: { status?: string; priority?: string; agent_id?: string }): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.agent_id) params.append('agent_id', filters.agent_id);
    const res = await fetch(`${API_BASE}/tasks?${params.toString()}`);
    return res.json();
  },

  getTaskGraph: async (): Promise<TaskGraphData> => {
    const res = await fetch(`${API_BASE}/task-graph`);
    return res.json();
  },

  getKanban: async (): Promise<Record<string, Task[]>> => {
    const res = await fetch(`${API_BASE}/kanban`);
    return res.json();
  },

  getMetrics: async (): Promise<SystemMetrics> => {
    const res = await fetch(`${API_BASE}/monitor`);
    return res.json();
  },

  getWorkflowRuns: async (): Promise<WorkflowRun[]> => {
    const res = await fetch(`${API_BASE}/github/runs`);
    return res.json();
  },

  getVmNodes: async (): Promise<VmNode[]> => {
    const res = await fetch(`${API_BASE}/vms`);
    return res.json();
  },

  syncVm: async (vmId: string) => {
    const res = await fetch(`${API_BASE}/vms/${vmId}/sync`, { method: 'POST' });
    return res.json();
  },

  getApprovals: async (): Promise<Approval[]> => {
    const res = await fetch(`${API_BASE}/approvals`);
    return res.json();
  },

  approveRequest: async (approvalId: string, actor: string = 'Human Operator') => {
    const res = await fetch(`${API_BASE}/approvals/${approvalId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor })
    });
    return res.json();
  },

  rejectRequest: async (approvalId: string, rationale: string, actor: string = 'Human Operator') => {
    const res = await fetch(`${API_BASE}/approvals/${approvalId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor, rationale })
    });
    return res.json();
  },

  submitPrompt: async (prompt: string) => {
    const res = await fetch(`${API_BASE}/system/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    return res.json();
  },

  toggleKillSwitch: async (active: boolean) => {
    const res = await fetch(`${API_BASE}/system/kill-switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active })
    });
    return res.json();
  },

  runDemoFailureLoop: async () => {
    const res = await fetch(`${API_BASE}/system/run-demo-failure-loop`, { method: 'POST' });
    return res.json();
  },

  // ---------------- BA & R&D ---------------- //
  getBaDiscussions: async (): Promise<BaDiscussion[]> => {
    const res = await fetch(`${API_BASE}/ba/discussions`);
    return res.json();
  },

  answerBaQuestion: async (discId: string, questionId: string, answer: string) => {
    const res = await fetch(`${API_BASE}/ba/discussions/${discId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: questionId, answer })
    });
    return res.json();
  },

  confirmBaProposal: async (discId: string, actor: string = 'Product Owner') => {
    const res = await fetch(`${API_BASE}/ba/discussions/${discId}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor })
    });
    return res.json();
  },

  getRdSuggestions: async (): Promise<RdSuggestion[]> => {
    const res = await fetch(`${API_BASE}/rd/suggestions`);
    return res.json();
  },

  approveRdSuggestion: async (id: string) => {
    const res = await fetch(`${API_BASE}/rd/suggestions/${id}/approve`, { method: 'POST' });
    return res.json();
  },

  dismissRdSuggestion: async (id: string) => {
    const res = await fetch(`${API_BASE}/rd/suggestions/${id}/dismiss`, { method: 'POST' });
    return res.json();
  },

  // ---------------- UI/UX ---------------- //
  getUiUxSpecs: async (): Promise<UiUxDesignSpec[]> => {
    const res = await fetch(`${API_BASE}/uiux/specs`);
    return res.json();
  },

  // ---------------- Legacy Regression ---------------- //
  getLegacyChecks: async (): Promise<LegacyRegressionCheck[]> => {
    const res = await fetch(`${API_BASE}/legacy/checks`);
    return res.json();
  },

  verifyLegacyRegression: async (id: string) => {
    const res = await fetch(`${API_BASE}/legacy/checks/${id}/verify`, { method: 'POST' });
    return res.json();
  }
};
