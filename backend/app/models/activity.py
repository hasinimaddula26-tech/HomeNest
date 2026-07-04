from sqlalchemy import Column, Integer, String, DateTime, func
from ..core.database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    description = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
