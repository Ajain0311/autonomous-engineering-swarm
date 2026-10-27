"""Configuration settings for Autonomous Engineering Swarm."""
import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseModel):
    PROJECT_NAME: str = "Autonomous Engineering Swarm"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite+aiosqlite:///{BASE_DIR}/swarm.db")
    
    # Concurrency and Reliability
    MAX_CONCURRENT_CODING_WORKERS: int = int(os.getenv("MAX_CONCURRENT_CODING_WORKERS", "8"))
    MAX_DEFECT_RETRIES: int = int(os.getenv("MAX_DEFECT_RETRIES", "3"))
    DEFAULT_TASK_LEASE_SECONDS: int = int(os.getenv("DEFAULT_TASK_LEASE_SECONDS", "600"))
    
    # Environment & Simulation
    SIMULATION_MODE: bool = os.getenv("SIMULATION_MODE", "True").lower() in ("true", "1", "yes")
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")
    GITHUB_WEBHOOK_SECRET: str = os.getenv("GITHUB_WEBHOOK_SECRET", "swarm_webhook_secret_dev")

settings = Settings()
