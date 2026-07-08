from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from typing import Any
from app.core.database import get_db
from app.schemas.reminder import ReminderCreate, ReminderUpdate
from app.services import reminder as reminder_service

from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/reminders", tags=["Reminders"])

@router.get("")
def read_reminders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    items = reminder_service.get_all_reminders(db, current_user.id)
    return {"success": True, "data": jsonable_encoder(items)}

@router.post("")
def create_reminder_item(reminder: ReminderCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    new_item = reminder_service.create_reminder(db, current_user.id, reminder)
    return {"success": True, "data": jsonable_encoder(new_item)}

@router.put("/{reminder_id}")
def update_reminder_item(reminder_id: int, reminder_update: ReminderUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    db_reminder = reminder_service.get_reminder_by_id(db, reminder_id)
    if not db_reminder or db_reminder.user_id != current_user.id:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Reminder not found"}
        )
    updated_item = reminder_service.update_reminder(db, db_reminder, reminder_update)
    return {"success": True, "data": jsonable_encoder(updated_item)}

@router.delete("/{reminder_id}")
def delete_reminder_item(reminder_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Any:
    db_reminder = reminder_service.get_reminder_by_id(db, reminder_id)
    if not db_reminder or db_reminder.user_id != current_user.id:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Reminder not found"}
        )
    reminder_service.delete_reminder(db, db_reminder)
    return {"success": True, "message": "Reminder deleted successfully"}
