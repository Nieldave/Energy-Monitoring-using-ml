from fastapi import APIRouter, Depends, Query
from app.core.security import get_current_user
from app.db.influxdb import influx_client
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta
import random

router = APIRouter()

class EnergyDataResponse(BaseModel):
    timestamp: str
    value: float
    deviceId: str

@router.get("", response_model=List[EnergyDataResponse])
async def get_energy_data(
    deviceId: Optional[str] = Query(None),
    startDate: Optional[str] = Query(None),
    endDate: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    # For development, generate mock historical data
    data = []
    
    # Default to last 24 hours if no dates provided
    if not startDate:
        start_dt = datetime.now() - timedelta(days=1)
    else:
        start_dt = datetime.fromisoformat(startDate)
    
    if not endDate:
        end_dt = datetime.now()
    else:
        end_dt = datetime.fromisoformat(endDate)
    
    # Generate data points at 1-hour intervals
    current_dt = start_dt
    device_ids = ["device1", "device2", "device3"] if not deviceId else [deviceId]
    
    while current_dt <= end_dt:
        for device_id in device_ids:
            # Generate a value with some randomness but following a pattern
            hour = current_dt.hour
            # More usage during day, less at night
            base_value = 2.0 + 3.0 * (1 - abs(hour - 12) / 12)
            value = base_value + random.uniform(-0.5, 0.5)
            
            data.append({
                "timestamp": current_dt.isoformat(),
                "value": round(value, 2),
                "deviceId": device_id
            })
        
        current_dt += timedelta(hours=1)
    
    return data

@router.get("/realtime", response_model=List[EnergyDataResponse])
async def get_realtime_energy_data(
    deviceId: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    # For development, generate mock realtime data
    data = []
    
    # Generate data points for the last hour at 5-minute intervals
    end_dt = datetime.now()
    start_dt = end_dt - timedelta(hours=1)
    
    current_dt = start_dt
    device_ids = ["device1", "device2", "device3"] if not deviceId else [deviceId]
    
    while current_dt <= end_dt:
        for device_id in device_ids:
            # Generate a value with some randomness
            value = 5.0 + random.uniform(-2.0, 2.0)
            
            data.append({
                "timestamp": current_dt.isoformat(),
                "value": round(value, 2),
                "deviceId": device_id
            })
        
        current_dt += timedelta(minutes=5)
    
    return data