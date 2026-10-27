#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "=========================================================="
echo "   Autonomous Engineering Swarm - Local Launcher"
echo "=========================================================="

echo -e "\n1. Checking Python dependencies..."
cd "$ROOT_DIR/backend"
pip install -r requirements.txt > /dev/null

echo -e "\n2. Running automated test verification..."
python -m pytest tests -v

echo -e "\n3. Launching Swarm Orchestrator & Dashboard at http://localhost:8080..."
uvicorn app.main:app --host 0.0.0.0 --port 8080
