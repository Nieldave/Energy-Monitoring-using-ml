from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session
from app.db.postgres import get_db
from app.models.models import Alert
from app.core.security import get_current_user
from pydantic import BaseModel
from typing import List
import uuid
from datetime import datetime, timedelta
import random

router = APIRouter()

class AlertResponse(BaseModel):
    id: str
    type: str
    message: str
    timestamp: str
    read: bool

@router.get("", response_model=List[AlertResponse])
async def get_alerts(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alerts = db.query(Alert).filter(Alert.user_id == current_user["sub"]).all()
    
    # If no alerts exist, create some mock alerts for development
    if not alerts:
        alert_types = ["budget", "anomaly", "system"]
        alert_messages = [
            "Energy usage exceeded daily budget by 15%",
            "Unusual energy consumption detected in Kitchen",
            "Living Room Smart Meter connection lost",
            "System maintenance scheduled for tomorrow",
            "Weekly energy report available"
        ]
        
        # Generate 5 random alerts
        mock_alerts = []
        now = datetime.utcnow()
        
        for i in range(5):
            alert_type = random.choice(alert_types)
            message = random.choice(alert_messages)
            timestamp = now - timedelta(hours=random.randint(1, 48))
            read = random.choice([True, False])
            
            mock_alerts.append(
                Alert(
                    id=str(uuid.uuid4()),
                    type=alert_type,
                    message=message,
                    timestamp=timestamp,
                    read=read,
                    user_id=current_user["sub"]
                )
            )
        
        db.add_all(mock_alerts)
        db.commit()
        
        alerts = mock_alerts
    
    return [
        {
            "id": alert.id,
            "type": alert.type,
            "message": alert.message,
            "timestamp": alert.timestamp.isoformat(),
            "read": alert.read
        }
        for alert in alerts
    ]

@router.put("/{id}/read")
async def mark_alert_as_read(
    id: str = Path(...),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alert = db.query(Alert).filter(
        Alert.id == id,
        Alert.user_id == current_user["sub"]
    ).first()
    
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    alert.read = True
    db.commit()
    
    return {"message": "Alert marked as read"}