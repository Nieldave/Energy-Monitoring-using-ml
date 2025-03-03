from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import logging
import time
from app.db.postgres import Base, engine
from app.core.errors import setup_exception_handlers
from app.routes import auth, users, energy_data, devices, alerts, budgets, ml, voice, ws
from app.services.mqtt_client import mqtt_client
import uvicorn

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("main")

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Energy Monitoring API",
    description="API for energy monitoring system",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup exception handlers
setup_exception_handlers(app)

# Add request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.4f}s")
    return response

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(energy_data.router, prefix="/api/energy-data", tags=["Energy Data"])
app.include_router(devices.router, prefix="/api/devices", tags=["Devices"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(budgets.router, prefix="/api/budgets", tags=["Budgets"])
app.include_router(ml.router, prefix="/api/ml", tags=["Machine Learning"])
app.include_router(voice.router, prefix="/api/voice", tags=["Voice Commands"])
app.include_router(ws.router, tags=["WebSocket"])

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up the application")
    # Connect to MQTT broker
    mqtt_client.connect()

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down the application")
    # Disconnect from MQTT broker
    mqtt_client.disconnect()

@app.get("/")
async def root():
    return {"message": "Energy Monitoring API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)