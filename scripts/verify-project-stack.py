#!/usr/bin/env python3
"""
Dynamic Project Stack Discovery Script.
Scans the current workspace to automatically detect language runtimes, package managers,
test commands, CI/CD pipelines, and deployment manifests.
"""

import os
import sys
import json
from pathlib import Path

def inspect_stack(root_dir: str = "."):
    root = Path(root_dir).resolve()
    report = {
        "root_directory": str(root),
        "runtimes": [],
        "package_managers": [],
        "test_commands": [],
        "build_commands": [],
        "ci_workflows": [],
        "containerization": [],
        "git_status": {}
    }

    # 1. Detect Python
    if (root / "pyproject.toml").exists() or (root / "requirements.txt").exists() or (root / "setup.py").exists():
        report["runtimes"].append("python")
        if (root / "poetry.lock").exists():
            report["package_managers"].append("poetry")
            report["test_commands"].append("poetry run pytest")
        elif (root / "Pipfile").exists():
            report["package_managers"].append("pipenv")
            report["test_commands"].append("pipenv run pytest")
        else:
            report["package_managers"].append("pip")
            report["test_commands"].append("pytest")

    # 2. Detect Node.js / TypeScript
    if (root / "package.json").exists():
        report["runtimes"].append("node")
        try:
            with open(root / "package.json", "r", encoding="utf-8") as f:
                pkg_data = json.load(f)
                scripts = pkg_data.get("scripts", {})
                if "test" in scripts:
                    report["test_commands"].append("npm test")
                if "build" in scripts:
                    report["build_commands"].append("npm run build")
                if "lint" in scripts:
                    report["build_commands"].append("npm run lint")
        except Exception:
            pass

        if (root / "pnpm-lock.yaml").exists():
            report["package_managers"].append("pnpm")
        elif (root / "yarn.lock").exists():
            report["package_managers"].append("yarn")
        else:
            report["package_managers"].append("npm")

    # 3. Detect Rust
    if (root / "Cargo.toml").exists():
        report["runtimes"].append("rust")
        report["package_managers"].append("cargo")
        report["test_commands"].append("cargo test")
        report["build_commands"].append("cargo build --release")

    # 4. Detect Go
    if (root / "go.mod").exists():
        report["runtimes"].append("go")
        report["package_managers"].append("go modules")
        report["test_commands"].append("go test ./...")
        report["build_commands"].append("go build ./...")

    # 5. Detect .NET
    csproj_files = list(root.glob("**/*.csproj"))
    if csproj_files or (root / "*.sln"):
        report["runtimes"].append("dotnet")
        report["package_managers"].append("nuget")
        report["test_commands"].append("dotnet test")
        report["build_commands"].append("dotnet build")

    # 6. Detect CI Workflows
    github_workflows = root / ".github" / "workflows"
    if github_workflows.exists():
        for yml in list(github_workflows.glob("*.yml")) + list(github_workflows.glob("*.yaml")):
            report["ci_workflows"].append(yml.name)

    # 7. Detect Containers & Orchestration
    if (root / "Dockerfile").exists():
        report["containerization"].append("Dockerfile")
    if (root / "docker-compose.yml").exists() or (root / "docker-compose.yaml").exists():
        report["containerization"].append("docker-compose")

    # 8. Detect Git State
    git_dir = root / ".git"
    if git_dir.exists():
        report["git_status"]["is_git_repo"] = True
    else:
        report["git_status"]["is_git_repo"] = False

    return report

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "."
    stack_info = inspect_stack(target)
    print(json.dumps(stack_info, indent=2))
