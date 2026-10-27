"""FastAPI Main Application Entrypoint."""
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os

from app.config import settings
from app.core.db import init_db
from app.demo.seeder import seed_demo_data
from app.core.orchestrator import orchestrator
from app.core.event_bus import event_bus
from app.api.routers import router as api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database and seed demo data
    await init_db()
    await seed_demo_data()
    await orchestrator.recover_from_crash()
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# Enable CORS for development frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix=settings.API_PREFIX)

# Realtime WebSocket Endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await event_bus.connect_ws(websocket)
    try:
        while True:
            # Keep connection open; receive heartbeats / pings
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        event_bus.disconnect_ws(websocket)
    except Exception:
        event_bus.disconnect_ws(websocket)

# Serve built frontend if available
frontend_dist = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="frontend")
else:
    @app.get("/")
    async def root():
        return {
            "system": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "status": "OPERATIONAL",
            "endpoints": {
                "api_docs": "/docs",
                "monitor": f"{settings.API_PREFIX}/monitor",
                "agents": f"{settings.API_PREFIX}/agents",
                "tasks": f"{settings.API_PREFIX}/tasks",
                "task_graph": f"{settings.API_PREFIX}/task-graph",
                "kanban": f"{settings.API_PREFIX}/kanban",
                "vms": f"{settings.API_PREFIX}/vms",
                "approvals": f"{settings.API_PREFIX}/approvals",
                "websocket": "/ws"
            }
        }
