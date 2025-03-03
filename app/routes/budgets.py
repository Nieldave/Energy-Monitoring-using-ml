from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session
from app.db.postgres import get_db
from app.models.models import Budget
from app.core.security import get_current_user
from pydantic import BaseModel
from typing import List, Optional
import uuid
import random

router = APIRouter()

class BudgetCreate(BaseModel):
    name: str
    limit: float
    period: str  # daily, weekly, monthly

class BudgetUpdate(BaseModel):
    name: Optional[str] = None
    limit: Optional[float] = None
    period: Optional[str] = None

class BudgetResponse(BaseModel):
    id: str
    name: str
    limit: float
    period: str
    currentUsage: float

@router.get("", response_model=List[BudgetResponse])
async def get_budgets(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    budgets = db.query(Budget).filter(Budget.user_id == current_user["sub"]).all()
    
    # If no budgets exist, create some mock budgets for development
    if not budgets:
        mock_budgets = [
            Budget(
                id=str(uuid.uuid4()),
                name="Daily Energy Budget",
                limit=10.0,
                period="daily",
                current_usage=8.5,
                user_id=current_user["sub"]
            ),
            Budget(
                id=str(uuid.uuid4()),
                name="Weekly Kitchen Budget",
                limit=50.0,
                period="weekly",
                current_usage=25.0,
                user_id=current_user["sub"]
            ),
            Budget(
                id=str(uuid.uuid4()),
                name="Monthly Home Budget",
                limit=200.0,
                period="monthly",
                current_usage=150.0,
                user_id=current_user["sub"]
            )
        ]
        
        db.add_all(mock_budgets)
        db.commit()
        
        budgets = mock_budgets
    
    return [
        {
            "id": budget.id,
            "name": budget.name,
            "limit": budget.limit,
            "period": budget.period,
            "currentUsage": budget.current_usage
        }
        for budget in budgets
    ]

@router.post("", response_model=BudgetResponse)
async def create_budget(
    budget_data: BudgetCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate period
    if budget_data.period not in ["daily", "weekly", "monthly"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Period must be one of: daily, weekly, monthly"
        )
    
    # Create new budget
    new_budget = Budget(
        id=str(uuid.uuid4()),
        name=budget_data.name,
        limit=budget_data.limit,
        period=budget_data.period,
        current_usage=0.0,  # Start with zero usage
        user_id=current_user["sub"]
    )
    
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    
    return {
        "id": new_budget.id,
        "name": new_budget.name,
        "limit": new_budget.limit,
        "period": new_budget.period,
        "currentUsage": new_budget.current_usage
    }

@router.put("/{id}", response_model=BudgetResponse)
async def update_budget(
    id: str = Path(...),
    budget_data: BudgetUpdate = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    budget = db.query(Budget).filter(
        Budget.id == id,
        Budget.user_id == current_user["sub"]
    ).first()
    
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found"
        )
    
    # Update budget fields if provided
    if budget_data.name:
        budget.name = budget_data.name
    if budget_data.limit is not None:
        budget.limit = budget_data.limit
    if budget_data.period:
        if budget_data.period not in ["daily", "weekly", "monthly"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Period must be one of: daily, weekly, monthly"
            )
        budget.period = budget_data.period
    
    db.commit()
    db.refresh(budget)
    
    return {
        "id": budget.id,
        "name": budget.name,
        "limit": budget.limit,
        "period": budget.period,
        "currentUsage": budget.current_usage
    }

@router.delete("/{id}")
async def delete_budget(
    id: str = Path(...),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    budget = db.query(Budget).filter(
        Budget.id == id,
        Budget.user_id == current_user["sub"]
    ).first()
    
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found"
        )
    
    db.delete(budget)
    db.commit()
    
    return {"message": "Budget deleted successfully"}