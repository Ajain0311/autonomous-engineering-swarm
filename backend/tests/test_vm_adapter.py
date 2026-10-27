"""Tests for VM Fleet adapter, drift detection, and secret redaction."""
import pytest
from app.adapters.vm_adapter import vm_adapter, redact_secrets

def test_secret_redaction():
    text_with_token = "Connecting using ghp_1234567890abcdef1234567890abcdef and password='SuperSecretPassword123'"
    redacted = redact_secrets(text_with_token)
    assert "ghp_" not in redacted
    assert "SuperSecretPassword123" not in redacted
    assert "[REDACTED_SECRET]" in redacted

@pytest.mark.asyncio
async def test_vm_health_and_drift_detection():
    node_data = {
        "alias": "vm-prod-db-01",
        "environment": "production",
        "status": "DRIFT_DETECTED",
        "current_version": "v1.1.0",
        "target_version": "v1.2.0",
        "drift_details": "Configuration drift: connection_pool=50 with secret_key=ghp_9876543210abcdef9876543210abcdef"
    }

    report = await vm_adapter.check_health(node_data)
    assert report["has_drift"] is True
    assert report["status"] == "DRIFT_DETECTED"
    # Ensure sensitive credentials inside drift details are masked
    assert "ghp_" not in report["drift_details"]
    assert "[REDACTED_SECRET]" in report["drift_details"]

@pytest.mark.asyncio
async def test_production_deployment_guard():
    node_data = {
        "alias": "vm-prod-01",
        "environment": "production",
        "approved": False
    }

    with pytest.raises(PermissionError):
        await vm_adapter.deploy_artifact(node_data, "v1.2.0", "a1b2c3d4")
