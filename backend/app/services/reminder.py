from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.reminder import Reminder
from app.schemas.reminder import ReminderCreate, ReminderUpdate
from app.services.activity import log_activity

def get_all_reminders(db: Session) -> List[Reminder]:
    return db.query(Reminder).order_by(Reminder.date.asc(), Reminder.created_at.desc()).all()

def get_reminder_by_id(db: Session, reminder_id: int) -> Optional[Reminder]:
    return db.query(Reminder).filter(Reminder.id == reminder_id).first()

def create_reminder(db: Session, reminder: ReminderCreate) -> Reminder:
    db_reminder = Reminder(
        title=reminder.title,
        description=reminder.description,
        type=reminder.type.value if hasattr(reminder.type, 'value') else reminder.type,
        date=reminder.date,
        is_completed=reminder.is_completed
    )
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    
    log_activity(db, f"Reminder '{db_reminder.title}' added")
    return db_reminder

def update_reminder(db: Session, db_reminder: Reminder, reminder_update: ReminderUpdate) -> Reminder:
    update_data = reminder_update.model_dump(exclude_unset=True)
    old_is_completed = db_reminder.is_completed
    
    for key, value in update_data.items():
        if key == "type" and value is not None:
            setattr(db_reminder, key, value.value if hasattr(value, 'value') else value)
        else:
            setattr(db_reminder, key, value)
            
    db.commit()
    db.refresh(db_reminder)
    
    # Log special activity on complete status change
    if old_is_completed != db_reminder.is_completed:
        action = "completed" if db_reminder.is_completed else "marked active"
        log_activity(db, f"Reminder '{db_reminder.title}' {action}")
    else:
        log_activity(db, f"Reminder '{db_reminder.title}' updated")
        
    return db_reminder

def delete_reminder(db: Session, db_reminder: Reminder) -> None:
    title = db_reminder.title
    db.delete(db_reminder)
    db.commit()
    log_activity(db, f"Reminder '{title}' deleted")
