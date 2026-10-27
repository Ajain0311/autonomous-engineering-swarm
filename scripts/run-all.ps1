# Windows Single-Command Swarm Runner
$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Autonomous Engineering Swarm - Local Launcher" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$Root = Split-Path -Parent $PSScriptRoot

Write-Host "`n1. Checking Python dependencies..." -ForegroundColor Yellow
Set-Location "$Root\backend"
python -m pip install -r requirements.txt | Out-Null

Write-Host "`n2. Running automated test verification..." -ForegroundColor Yellow
python -m pytest tests -v
if ($LASTEXITCODE -ne 0) {
    Write-Host "Tests failed! Aborting startup." -ForegroundColor Red
    exit 1
}

Write-Host "`n3. Launching Swarm Orchestrator & Dashboard at http://localhost:8000..." -ForegroundColor Green
Write-Host "   (Serving unified React frontend and FastAPI backend)" -ForegroundColor Cyan
Write-Host "   Press Ctrl+C to stop.`n"

python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
