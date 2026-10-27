# Agent Task Contract Specifications

Every task dispatched to an agent or worker must be governed by an explicit contract and must return a verifiable result schema.

## 1. Task Dispatch Contract Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "AgentTaskContract",
  "type": "object",
  "required": [
    "task_id",
    "project_id",
    "assigned_role",
    "title",
    "goal",
    "acceptance_criteria",
    "allowed_file_patterns",
    "test_command",
    "budget"
  ],
  "properties": {
    "task_id": { "type": "string", "pattern": "^TASK-[0-9]{3,}$" },
    "project_id": { "type": "string" },
    "assigned_role": { "type": "string" },
    "title": { "type": "string" },
    "goal": { "type": "string" },
    "acceptance_criteria": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 1
    },
    "repository_url": { "type": "string" },
    "base_commit": { "type": "string" },
    "target_branch": { "type": "string" },
    "allowed_file_patterns": {
      "type": "array",
      "items": { "type": "string" }
    },
    "dependencies": {
      "type": "array",
      "items": { "type": "string" }
    },
    "test_command": { "type": "string" },
    "budget": {
      "type": "object",
      "properties": {
        "max_duration_seconds": { "type": "integer", "default": 600 },
        "max_retries": { "type": "integer", "default": 3 },
        "token_limit": { "type": "integer", "default": 100000 }
      }
    }
  }
}
```

---

## 2. Worker Result Evidence Schema

Workers must report output in this structured JSON format:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "WorkerResultEvidence",
  "type": "object",
  "required": [
    "task_id",
    "status",
    "commit_sha",
    "changed_files",
    "commands_executed",
    "test_results"
  ],
  "properties": {
    "task_id": { "type": "string" },
    "status": { "type": "string", "enum": ["COMPLETED", "FAILED", "BLOCKED"] },
    "summary_of_changes": { "type": "string" },
    "commit_sha": { "type": "string" },
    "changed_files": {
      "type": "array",
      "items": { "type": "string" }
    },
    "commands_executed": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "command": { "type": "string" },
          "exit_code": { "type": "integer" },
          "stdout_summary": { "type": "string" }
        }
      }
    },
    "test_results": {
      "type": "object",
      "properties": {
        "passed": { "type": "boolean" },
        "total_tests": { "type": "integer" },
        "failures": { "type": "integer" },
        "artifact_paths": { "type": "array", "items": { "type": "string" } }
      }
    },
    "known_risks": { "type": "array", "items": { "type": "string" } },
    "blockers": { "type": "array", "items": { "type": "string" } },
    "follow_up_tasks": { "type": "array", "items": { "type": "string" } }
  }
}
```
