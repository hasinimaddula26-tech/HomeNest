from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Any
from app.core.database import get_db
from app.schemas.reminder import ReminderCreate, ReminderUpdate
from app.services import reminder as reminder_service

router = APIRouter(prefix="/reminders", tags=["Reminders"])

@router.get("")
def read_reminders(db: Session = Depends(get_db)) -> Any:
    items = reminder_service.get_all_reminders(db)
    return {"success": True, "data": items}

@router.post("")
def create_reminder_item(reminder: ReminderCreate, db: Session = Depends(get_db)) -> Any:
    new_item = reminder_service.create_reminder(db, reminder)
    return {"success": True, "data": new_item}

@router.put("/{reminder_id}")
def update_reminder_item(reminder_id: int, reminder_update: ReminderUpdate, db: Session = Depends(get_db)) -> Any:
    db_reminder = reminder_service.get_reminder_by_id(db, reminder_id)
    if not db_reminder:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Reminder not found"}
        )
    updated_item = reminder_service.update_reminder(db, db_reminder, reminder_update)
    return {"success": True, "data": updated_item}

@router.delete("/{reminder_id}")
def delete_reminder_item(reminder_id: int, db: Session = Depends(get_db)) -> Any:
    db_reminder = reminder_service.get_reminder_by_id(db, reminder_id)
    if not db_reminder:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "Reminder not found"}
        )
    reminder_service.delete_reminder(db, db_reminder)
    return {"success": True, "message": "Reminder deleted successfully"}
