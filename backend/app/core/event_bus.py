"""In-memory event bus and WebSocket real-time broadcast."""
import asyncio
import json
from typing import List, Dict, Any, Callable
from datetime import datetime
from starlette.websockets import WebSocket

class EventBus:
    def __init__(self):
        self._subscribers: List[Callable[[Dict[str, Any]], None]] = []
        self._active_connections: List[WebSocket] = []

    async def connect_ws(self, websocket: WebSocket):
        await websocket.accept()
        self._active_connections.append(websocket)

    def disconnect_ws(self, websocket: WebSocket):
        if websocket in self._active_connections:
            self._active_connections.remove(websocket)

    async def publish(self, event_type: str, payload: Dict[str, Any]):
        message = {
            "type": event_type,
            "timestamp": datetime.utcnow().isoformat(),
            "data": payload
        }
        # Notify internal python subscribers
        for subscriber in self._subscribers:
            try:
                if asyncio.iscoroutinefunction(subscriber):
                    await subscriber(message)
                else:
                    subscriber(message)
            except Exception as e:
                print(f"[EventBus Error] Subscriber failed: {e}")

        # Broadcast to active WebSockets
        dead_connections = []
        for ws in self._active_connections:
            try:
                await ws.send_text(json.dumps(message))
            except Exception:
                dead_connections.append(ws)

        for dead_ws in dead_connections:
            self.disconnect_ws(dead_ws)

    def subscribe(self, callback: Callable[[Dict[str, Any]], None]):
        self._subscribers.append(callback)

event_bus = EventBus()
