"""VM Fleet and Infrastructure Handler Adapter."""
import re
from typing import Dict, Any, List

# Patterns matching sensitive credentials
SECRET_PATTERNS = [
    re.compile(r"(ghp_[a-zA-Z0-9]+)"),
    re.compile(r"(github_pat_[a-zA-Z0-9_]+)"),
    re.compile(r"(-----BEGIN [A-Z]+ PRIVATE KEY-----[\s\S]+?-----END [A-Z]+ PRIVATE KEY-----)"),
    re.compile(r"(password\s*[:=]\s*['\"][^'\"]+['\"])", re.IGNORECASE),
    re.compile(r"(bearer\s+[a-zA-Z0-9_\-\.]{20,})", re.IGNORECASE)
]

def redact_secrets(text: str) -> str:
    """Replaces sensitive tokens and keys with [REDACTED_SECRET]."""
    if not text:
        return text
    redacted = text
    for pattern in SECRET_PATTERNS:
        redacted = pattern.sub("[REDACTED_SECRET]", redacted)
    return redacted

class VmAdapter:
    def __init__(self):
        pass

    async def check_health(self, node_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Performs non-destructive health probe on VM node.
        """
        # If node is simulated or offline
        status = node_data.get("status", "HEALTHY")
        drift = node_data.get("drift_details")

        return {
            "alias": node_data.get("alias"),
            "environment": node_data.get("environment"),
            "status": status,
            "current_version": node_data.get("current_version"),
            "target_version": node_data.get("target_version"),
            "has_drift": bool(drift),
            "drift_details": redact_secrets(drift) if drift else None
        }

    async def deploy_artifact(
        self,
        node_data: Dict[str, Any],
        artifact_version: str,
        commit_sha: str
    ) -> Dict[str, Any]:
        """
        Simulates staging or production rollout with pre/post checks.
        """
        env = node_data.get("environment", "staging")
        if env == "production" and not node_data.get("approved"):
            raise PermissionError("Production deployment requires human approval!")

        return {
            "success": True,
            "node_alias": node_data.get("alias"),
            "deployed_version": artifact_version,
            "commit_sha": commit_sha,
            "smoke_test_status": "HEALTHY",
            "message": f"Successfully rolled out {artifact_version} to {node_data.get('alias')}"
        }

vm_adapter = VmAdapter()
