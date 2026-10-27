import { Agent, Task, TaskGraphData, SystemMetrics, WorkflowRun, VmNode, Approval } from '../types';

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
  }
};
