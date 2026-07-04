from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from ..core.database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    activity_type = Column(String(50), default="General", nullable=False)
    message = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
