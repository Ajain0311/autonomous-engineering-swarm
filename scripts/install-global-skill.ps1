# Windows PowerShell Global Skill Installer for Antigravity Swarm
$ErrorActionPreference = "Stop"

$UserHome = [System.Environment]::GetFolderPath('UserProfile')
$TargetDir = Join-Path $UserHome ".gemini\config\skills\autonomous-engineering-swarm"
$ConfigFile = Join-Path $UserHome ".gemini\config\skills.json"

Write-Host "Installing Autonomous Engineering Swarm global skill..." -ForegroundColor Cyan
Write-Host "Destination: $TargetDir"

if (-not (Test-Path $TargetDir)) {
    New-Item -ItemType Directory -Force -Path $TargetDir | Out-Null
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SourceSkillDir = Join-Path (Split-Path -Parent $ScriptDir) ".agents\skills\autonomous-engineering-swarm"

Copy-Item -Path "$SourceSkillDir\*" -Destination $TargetDir -Recurse -Force

# Verify skills.json
$ConfigDir = Split-Path -Parent $ConfigFile
if (-not (Test-Path $ConfigDir)) {
    New-Item -ItemType Directory -Force -Path $ConfigDir | Out-Null
}

if (-not (Test-Path $ConfigFile)) {
    $defaultJson = @{
        entries = @(
            @{ path = "skills" }
        )
    } | ConvertTo-Json -Depth 5
    Set-Content -Path $ConfigFile -Value $defaultJson -Encoding UTF8
    Write-Host "Created global skills.json manifest." -ForegroundColor Green
}

Write-Host "Autonomous Engineering Swarm global skill successfully installed!" -ForegroundColor Green
Write-Host "Antigravity can now orchestrate 17-role engineering swarms across any project."
