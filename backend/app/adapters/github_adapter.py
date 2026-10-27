"""GitHub Integration, Webhooks, and Actions Watcher Adapter."""
import hmac
import hashlib
import json
from typing import Dict, Any, Optional, List
from app.config import settings

class GitHubAdapter:
    def __init__(self, token: Optional[str] = None, webhook_secret: Optional[str] = None):
        self.token = token or settings.GITHUB_TOKEN
        self.webhook_secret = webhook_secret or settings.GITHUB_WEBHOOK_SECRET
        self.processed_deliveries: set = set()

    def verify_webhook_signature(self, payload_bytes: bytes, signature_header: Optional[str]) -> bool:
        """Verifies HMAC SHA-256 webhook signature."""
        if not signature_header or not signature_header.startswith("sha256="):
            return False
        expected_sig = "sha256=" + hmac.new(
            self.webhook_secret.encode("utf-8"),
            payload_bytes,
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(expected_sig, signature_header)

    def is_duplicate_delivery(self, delivery_id: str) -> bool:
        """Deduplicates GitHub webhook delivery events."""
        if not delivery_id:
            return False
        if delivery_id in self.processed_deliveries:
            return True
        self.processed_deliveries.add(delivery_id)
        return False

    def classify_ci_failure(self, step_name: str, log_text: str) -> str:
        """
        Classifies CI failure into:
        - CODE_ERROR
        - DEPENDENCY
        - INFRASTRUCTURE
        - FLAKY
        """
        log_lower = log_text.lower()
        if "npm err! 404" in log_lower or "could not resolve dependency" in log_lower or "pip error: no matching distribution" in log_lower:
            return "DEPENDENCY"
        elif "connection timed out" in log_lower or "runner lost communication" in log_lower or "out of disk" in log_lower:
            return "INFRASTRUCTURE"
        elif "flaky" in log_lower or "timeout waiting for locator" in log_lower:
            return "FLAKY"
        else:
            return "CODE_ERROR"

    async def get_repositories(self) -> List[Dict[str, Any]]:
        """Returns list of accessible repositories (real if token set, otherwise realistic test catalog)."""
        if self.token:
            # When live token exists, query GitHub API
            import httpx
            headers = {"Authorization": f"Bearer {self.token}", "Accept": "application/vnd.github+json"}
            async with httpx.AsyncClient() as client:
                res = await client.get("https://api.github.com/user/repos?per_page=10", headers=headers)
                if res.status_code == 200:
                    return res.json()

        # Simulated repository catalog
        return [
            {
                "id": 101,
                "name": "autonomous-engineering-swarm",
                "full_name": "org/autonomous-engineering-swarm",
                "default_branch": "main",
                "private": False,
                "simulated": True
            },
            {
                "id": 102,
                "name": "SuperApp_V2",
                "full_name": "org/SuperApp_V2",
                "default_branch": "main",
                "private": False,
                "simulated": True
            }
        ]

github_adapter = GitHubAdapter()
