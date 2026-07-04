from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Boolean, func
from ..core.database import Base

class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(String(30), default="General", nullable=False)
    date = Column(Date, nullable=False)
    is_completed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
