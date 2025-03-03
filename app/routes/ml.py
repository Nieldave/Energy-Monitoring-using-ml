from fastapi import APIRouter, Depends, Query
from app.core.security import get_current_user
from app.services.ml_service import ml_service
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta
import random

router = APIRouter()

class EnergyForecastResponse(BaseModel):
    timestamp: str
    value: float
    deviceId: str

class AnomalyResponse(BaseModel):
    timestamp: str
    value: float
    deviceId: str
    confidence: float
    type: str

@router.get("/forecast", response_model=List[EnergyForecastResponse])
async def get_energy_forecast(
    deviceId: str = Query(...),
    days: int = Query(7, ge=1, le=30),
    current_user: dict = Depends(get_current_user)
):
    # For development, generate mock forecast data
    forecast_data = []
    
    # Start from tomorrow
    start_date = datetime.now() + timedelta(days=1)
    
    # Generate hourly forecasts for the requested number of days
    for day in range(days):
        current_date = start_date + timedelta(days=day)
        
        # Generate 24 hourly data points for each day
        for hour in range(24):
            timestamp = current_date.replace(hour=hour, minute=0, second=0)
            
            # Create a realistic pattern: higher usage during day, lower at night
            hour_factor = 1 - abs(hour - 12) / 12  # Peaks at noon
            day_factor = 0.8 + 0.4 * (day % 7) / 6  # Weekly pattern
            
            # Base value with some randomness
            base_value = 5.0 * hour_factor * day_factor
            value = base_value + random.uniform(-0.5, 0.5)
            
            forecast_data.append({
                "timestamp": timestamp.isoformat(),
                "value": round(value, 2),
                "deviceId": deviceId
            })
    
    return forecast_data

@router.get("/anomalies", response_model=List[AnomalyResponse])
async def detect_anomalies(
    deviceId: str = Query(...),
    current_user: dict = Depends(get_current_user)
):
    # For development, generate mock anomaly data
    anomaly_data = []
    
    # Generate a few random anomalies in the past week
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)
    
    # Generate 3-5 anomalies
    num_anomalies = random.randint(3, 5)
    anomaly_types = ["spike", "drop", "unusual_pattern"]
    
    for _ in range(num_anomalies):
        # Random timestamp within the past week
        days_ago = random.uniform(0, 7)
        timestamp = end_date - timedelta(days=days_ago)
        
        # Anomaly value (significantly higher or lower than normal)
        anomaly_type = random.choice(anomaly_types)
        
        if anomaly_type == "spike":
            value = random.uniform(10.0, 15.0)  # Higher than normal
        elif anomaly_type == "drop":
            value = random.uniform(0.1, 0.5)  # Lower than normal
        else:
            value = random.uniform(5.0, 8.0)  # Within normal range but unusual pattern
        
        anomaly_data.append({
            "timestamp": timestamp.isoformat(),
            "value": round(value, 2),
            "deviceId": deviceId,
            "confidence": round(random.uniform(0.7, 0.98), 2),
            "type": anomaly_type
        })
    
    # Sort by timestamp
    anomaly_data.sort(key=lambda x: x["timestamp"])
    
    return anomaly_data