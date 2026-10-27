# VM Fleet Configuration Guide

The VM Fleet Handler coordinates deployments and health checks across staging and production nodes.

## Sample Inventory Configuration

```json
[
  {
    "id": "vm-stage-01",
    "alias": "staging-api-primary",
    "environment": "staging",
    "host": "10.0.1.15",
    "role": "api",
    "current_version": "v1.2.0-rc",
    "target_version": "v1.2.0-rc",
    "status": "HEALTHY",
    "health_check_url": "http://10.0.1.15:8000/health"
  },
  {
    "id": "vm-prod-01",
    "alias": "prod-api-eu-central",
    "environment": "production",
    "host": "10.0.2.20",
    "role": "api",
    "current_version": "v1.1.9",
    "target_version": "v1.2.0",
    "status": "HEALTHY",
    "health_check_url": "https://api.internal/health"
  }
]
```

## Security Best Practices
- Never commit private SSH keys, sudo passwords, or cloud tokens into inventory files.
- Use SSH agent forwarding or key vaults.
- Always execute staging rollout and smoke tests before requesting production signoff.
