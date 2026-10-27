"""Tests for GitHub Adapter, Webhook HMAC, Deduplication, and CI Classification."""
import hmac
import hashlib
from app.adapters.github_adapter import GitHubAdapter

def test_webhook_hmac_verification():
    secret = "test_webhook_secret_123"
    adapter = GitHubAdapter(webhook_secret=secret)
    body = b'{"action":"workflow_job_completed"}'

    # Compute valid signature
    valid_sig = "sha256=" + hmac.new(secret.encode("utf-8"), body, hashlib.sha256).hexdigest()
    assert adapter.verify_webhook_signature(body, valid_sig) is True

    # Bad signature
    assert adapter.verify_webhook_signature(body, "sha256=invalidhex123") is False

def test_duplicate_delivery_deduplication():
    adapter = GitHubAdapter()
    delivery_id = "guid-delivery-12345"

    assert adapter.is_duplicate_delivery(delivery_id) is False
    # Second arrival of same delivery ID must be flagged as duplicate
    assert adapter.is_duplicate_delivery(delivery_id) is True

def test_ci_failure_classification():
    adapter = GitHubAdapter()

    # Dependency error
    cat = adapter.classify_ci_failure("Install Dependencies", "npm ERR! 404 Not Found: package-xyz")
    assert cat == "DEPENDENCY"

    # Infrastructure error
    cat = adapter.classify_ci_failure("Run Runner", "fatal: Runner lost communication with server: out of disk space")
    assert cat == "INFRASTRUCTURE"

    # Flaky test
    cat = adapter.classify_ci_failure("Playwright Test", "Timeout waiting for locator: [flaky] modal element")
    assert cat == "FLAKY"

    # Code / assertion error
    cat = adapter.classify_ci_failure("Pytest Core", "AssertionError: Expected 200, got 500")
    assert cat == "CODE_ERROR"
