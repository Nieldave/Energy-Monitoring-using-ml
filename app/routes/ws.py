from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from app.core.security import get_current_user_ws
import json
import time
import asyncio
import logging

router = APIRouter()
logger = logging.getLogger("websocket")

class ConnectionManager:
    def __init__(self):
        self.active_connections = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"New WebSocket connection. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket disconnected. Remaining connections: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting message: {str(e)}")
                disconnected.append(connection)
        
        # Clean up disconnected connections
        for conn in disconnected:
            self.disconnect(conn)

manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = None):
    # Authenticate the connection
    user = None
    if token:
        user = await get_current_user_ws(token)
    
    await manager.connect(websocket)
    
    try:
        # Send initial data
        await websocket.send_json({
            "type": "connection_established",
            "authenticated": user is not None,
            "timestamp": time.time()
        })
        
        # Start heartbeat task
        heartbeat_task = asyncio.create_task(send_heartbeat(websocket))
        
        # Start mock data task (for development)
        mock_data_task = asyncio.create_task(send_mock_data(websocket))
        
        # Wait for messages to keep connection alive
        while True:
            data = await websocket.receive_text()
            # Process any incoming messages if needed
    
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
        manager.disconnect(websocket)
        heartbeat_task.cancel()
        mock_data_task.cancel()
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        manager.disconnect(websocket)
        heartbeat_task.cancel()
        mock_data_task.cancel()
        await websocket.close(code=status.WS_1011_INTERNAL_ERROR)

async def send_heartbeat(websocket: WebSocket):
    try:
        while True:
            await asyncio.sleep(30)
            await websocket.send_json({"type": "heartbeat", "timestamp": time.time()})
    except Exception:
        pass  # The main handler will take care of disconnection

async def send_mock_data(websocket: WebSocket):
    """Send mock energy data for development purposes"""
    try:
        import random
        from datetime import datetime
        
        device_ids = ["device1", "device2", "device3"]
        
        while True:
            await asyncio.sleep(5)  # Send data every 5 seconds
            
            # Generate random energy data
            device_id = random.choice(device_ids)
            value = random.uniform(0.5, 10.0)
            
            # Send energy data update
            await websocket.send_json({
                "type": "energy_data",
                "payload": {
                    "timestamp": datetime.now().isoformat(),
                    "value": round(value, 2),
                    "deviceId": device_id
                }
            })
            
            # Occasionally send device status updates
            if random.random() < 0.2:  # 20% chance
                await websocket.send_json({
                    "type": "device_status",
                    "payload": {
                        "id": random.choice(device_ids),
                        "status": random.choice(["online", "offline"])
                    }
                })
            
            # Occasionally send alerts
            if random.random() < 0.1:  # 10% chance
                alert_types = ["budget", "anomaly", "system"]
                alert_messages = [
                    "Energy usage exceeded budget",
                    "Unusual energy consumption detected",
                    "Device connection lost",
                    "System maintenance required"
                ]
                
                await websocket.send_json({
                    "type": "alert",
                    "payload": {
                        "id": f"alert-{int(time.time())}",
                        "type": random.choice(alert_types),
                        "message": random.choice(alert_messages),
                        "timestamp": datetime.now().isoformat(),
                        "read": False
                    }
                })
                
            # Occasionally send budget updates
            if random.random() < 0.1:  # 10% chance
                await websocket.send_json({
                    "type": "budget_update",
                    "payload": {
                        "id": f"budget-{random.randint(1, 3)}",
                        "usage": random.uniform(50, 150)
                    }
                })
    except Exception:
        pass  # The main handler will take care of disconnection