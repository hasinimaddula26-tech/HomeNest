from sqlalchemy.orm import Session
from typing import Optional
from app.models.activity import Activity

def log_activity(db: Session, message: str, activity_type: str = "General", user_id: Optional[int] = None) -> Activity:
    db_activity = Activity(user_id=user_id, activity_type=activity_type, message=message)
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

def get_recent_activities(db: Session, user_id: int, limit: int = 10):
    return db.query(Activity).filter(Activity.user_id == user_id).order_by(Activity.created_at.desc()).limit(limit).all()
