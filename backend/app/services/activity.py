from sqlalchemy.orm import Session
from app.models.activity import Activity

def log_activity(db: Session, description: str) -> Activity:
    db_activity = Activity(description=description)
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

def get_recent_activities(db: Session, limit: int = 10):
    return db.query(Activity).order_by(Activity.created_at.desc()).limit(limit).all()
