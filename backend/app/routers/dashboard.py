from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from typing import Any
from app.core.database import get_db
from app.services import dashboard as dashboard_service
from app.services import activity as activity_service

from app.schemas.bill import BillResponse
from app.schemas.reminder import ReminderResponse
from app.schemas.expense import ExpenseResponse
from app.schemas.activity import ActivityResponse

from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/metrics")
def get_metrics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    data = dashboard_service.get_dashboard_metrics(db, current_user.id)
    return {"success": True, "data": jsonable_encoder(data)}

@router.get("/upcoming-bills")
def get_upcoming_bills(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    data = dashboard_service.get_upcoming_bills(db, current_user.id)
    return {"success": True, "data": [BillResponse.model_validate(item).model_dump(mode="json") for item in data]}

@router.get("/today-reminders")
def get_today_reminders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    data = dashboard_service.get_today_reminders(db, current_user.id)
    return {"success": True, "data": [ReminderResponse.model_validate(item).model_dump(mode="json") for item in data]}

@router.get("/recent-expenses")
def get_recent_expenses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    data = dashboard_service.get_recent_expenses(db, current_user.id)
    return {"success": True, "data": [ExpenseResponse.model_validate(item).model_dump(mode="json") for item in data]}

@router.get("/notifications")
def get_notifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    data = dashboard_service.get_dashboard_notifications(db, current_user.id)
    return {"success": True, "data": jsonable_encoder(data)}

@router.get("/recent-activity")
def get_recent_activity(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    data = activity_service.get_recent_activities(db, current_user.id)
    return {"success": True, "data": [ActivityResponse.model_validate(item).model_dump(mode="json") for item in data]}
