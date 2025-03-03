from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session
from app.db.postgres import get_db
from app.models.models import Device
from app.core.security import get_current_user
from pydantic import BaseModel
from typing import List, Optional
import uuid

router = APIRouter()

class DeviceCreate(BaseModel):
    name: str
    type: str
    location: str

class DeviceUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None

class DeviceResponse(BaseModel):
    id: str
    name: str
    type: str
    location: str
    status: str

@router.get("", response_model=List[DeviceResponse])
async def get_devices(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    devices = db.query(Device).filter(Device.user_id == current_user["sub"]).all()
    
    # If no devices exist, create some mock devices for development
    if not devices:
        mock_devices = [
            Device(
                id=str(uuid.uuid4()),
                name="Living Room Smart Meter",
                type="Smart Meter",
                location="Living Room",
                status="online",
                user_id=current_user["sub"]
            ),
            Device(
                id=str(uuid.uuid4()),
                name="Kitchen Appliance Monitor",
                type="Appliance Monitor",
                location="Kitchen",
                status="online",
                user_id=current_user["sub"]
            ),
            Device(
                id=str(uuid.uuid4()),
                name="Bedroom Light Controller",
                type="Light Controller",
                location="Bedroom",
                status="offline",
                user_id=current_user["sub"]
            )
        ]
        
        db.add_all(mock_devices)
        db.commit()
        
        devices = mock_devices
    
    return [
        {
            "id": device.id,
            "name": device.name,
            "type": device.type,
            "location": device.location,
            "status": device.status
        }
        for device in devices
    ]

@router.get("/{id}", response_model=DeviceResponse)
async def get_device_by_id(
    id: str = Path(...),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    device = db.query(Device).filter(
        Device.id == id,
        Device.user_id == current_user["sub"]
    ).first()
    
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    
    return {
        "id": device.id,
        "name": device.name,
        "type": device.type,
        "location": device.location,
        "status": device.status
    }

@router.put("/{id}", response_model=DeviceResponse)
async def update_device(
    id: str = Path(...),
    device_data: DeviceUpdate = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    device = db.query(Device).filter(
        Device.id == id,
        Device.user_id == current_user["sub"]
    ).first()
    
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    
    # Update device fields if provided
    if device_data.name:
        device.name = device_data.name
    if device_data.type:
        device.type = device_data.type
    if device_data.location:
        device.location = device_data.location
    if device_data.status:
        device.status = device_data.status
    
    db.commit()
    db.refresh(device)
    
    return {
        "id": device.id,
        "name": device.name,
        "type": device.type,
        "location": device.location,
        "status": device.status
    }