from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from app.core.database import Base

class Grocery(Base):
    __tablename__ = "groceries"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String(100), nullable=False)
    quantity = Column(Integer, default=1)
    unit = Column(String(20), default="Pcs")
    category = Column(String(50), default="Others")
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
