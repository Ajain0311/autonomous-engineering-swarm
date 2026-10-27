export type TaskStatus = 
  | 'PLANNED'
  | 'READY'
  | 'IN_PROGRESS'
  | 'REVIEW'
  | 'TESTING'
  | 'READY_TO_RELEASE'
  | 'VERIFIED'
  | 'BLOCKED'
  | 'FAILED'
  | 'CANCELLED';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'IDLE' | 'RUNNING' | 'BLOCKED' | 'FAILED' | 'COMPLETED';
  current_task_id: string | null;
  parent_id: string | null;
  model: string;
  tasks_completed: number;
  tasks_failed: number;
  last_activity: string | null;
  logs: string[];
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  goal: string;
  status: TaskStatus;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  assigned_agent_id: string | null;
  assigned_by_agent_id: string;
  commit_sha: string | null;
  dependencies: string[];
  acceptance_criteria: string[];
  allowed_files: string[];
  test_command: string | null;
  test_passed: boolean;
  test_output: string | null;
  retries: number;
  max_retries: number;
  error_message: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface TaskAssignmentEvent {
  id: number;
  task_id: string;
  from_agent: string;
  from_role: string;
  to_agent: string;
  to_role: string;
  status: string;
  rationale: string | null;
  assigned_at: string | null;
}

export interface TaskGraphData {
  nodes: {
    id: string;
    title: string;
    status: TaskStatus;
    priority: string;
    assigned_agent_id: string | null;
    assigned_agent_name: string;
    dependencies: string[];
    commit_sha: string | null;
  }[];
  edges: {
    source: string;
    target: string;
    type: string;
  }[];
  assignment_events: TaskAssignmentEvent[];
}

export interface SystemMetrics {
  active_workers: number;
  max_workers: number;
  queue_length: number;
  running_tests: number;
  ci_failures: number;
  active_deployments: number;
  healthy_vms: number;
  verified_criteria_percent: number;
  kill_switch_active: boolean;
  total_tasks: number;
  verified_tasks: number;
}

export interface WorkflowRun {
  id: string;
  repo: string;
  branch: string;
  commit_sha: string;
  workflow_name: string;
  status: string;
  conclusion: string;
  failed_step: string | null;
  failure_category: string | null;
  linked_task_id: string | null;
  log_excerpt: string | null;
  simulated: boolean;
  created_at: string;
}

export interface VmNode {
  id: string;
  alias: string;
  environment: 'staging' | 'production';
  host: string;
  role: string;
  current_version: string;
  target_version: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DRIFT_DETECTED' | 'OFFLINE';
  drift_details: string | null;
  is_simulated: boolean;
  last_sync_at: string | null;
}

export interface Approval {
  id: string;
  project_id: string;
  action_type: string;
  title: string;
  commit_sha: string | null;
  risk_summary: string;
  test_evidence: string | null;
  rollback_plan: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}
