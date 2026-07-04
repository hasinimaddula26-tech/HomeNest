from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime, Boolean, func
from ..core.database import Base

class Bill(Base):
    __tablename__ = "bills"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    category = Column(String(50), default="Others", nullable=False)
    due_date = Column(Date, nullable=False)
    is_paid = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
