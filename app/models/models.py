from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.postgres import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    devices = relationship("Device", back_populates="user")
    budgets = relationship("Budget", back_populates="user")

class Device(Base):
    __tablename__ = "devices"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    location = Column(String)
    status = Column(String, default="offline")
    user_id = Column(String, ForeignKey("users.id"))
    
    user = relationship("User", back_populates="devices")

class Budget(Base):
    __tablename__ = "budgets"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    limit = Column(Float, nullable=False)
    period = Column(String, nullable=False)  # daily, weekly, monthly
    current_usage = Column(Float, default=0.0)
    user_id = Column(String, ForeignKey("users.id"))
    
    user = relationship("User", back_populates="budgets")

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(String, primary_key=True)
    type = Column(String, nullable=False)  # budget, anomaly, system
    message = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    read = Column(Boolean, default=False)
    user_id = Column(String, ForeignKey("users.id"))