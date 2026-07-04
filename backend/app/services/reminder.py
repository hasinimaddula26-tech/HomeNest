from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.reminder import Reminder
from app.schemas.reminder import ReminderCreate, ReminderUpdate
from app.services.activity import log_activity

def get_all_reminders(db: Session, user_id: int) -> List[Reminder]:
    return db.query(Reminder).filter(Reminder.user_id == user_id).order_by(Reminder.date.asc(), Reminder.created_at.desc()).all()

def get_reminder_by_id(db: Session, reminder_id: int) -> Optional[Reminder]:
    return db.query(Reminder).filter(Reminder.id == reminder_id).first()

def create_reminder(db: Session, user_id: int, reminder: ReminderCreate) -> Reminder:
    db_reminder = Reminder(
        user_id=user_id,
        title=reminder.title,
        description=reminder.description,
        type=reminder.type.value if hasattr(reminder.type, 'value') else reminder.type,
        date=reminder.date,
        is_completed=reminder.is_completed
    )
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    
    log_activity(db, message=f"Set reminder '{db_reminder.title}'", activity_type="Reminder", user_id=user_id)
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
        log_activity(db, message=f"Reminder '{db_reminder.title}' {action}", activity_type="Reminder", user_id=db_reminder.user_id)
    else:
        log_activity(db, message=f"Updated reminder '{db_reminder.title}' details", activity_type="Reminder", user_id=db_reminder.user_id)
        
    return db_reminder

def delete_reminder(db: Session, db_reminder: Reminder) -> None:
    title = db_reminder.title
    user_id = db_reminder.user_id
    db.delete(db_reminder)
    db.commit()
    log_activity(db, message=f"Deleted reminder '{title}'", activity_type="Reminder", user_id=user_id)
