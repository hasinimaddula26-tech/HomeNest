from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func
from ..core.database import Base

class Grocery(Base):
    __tablename__ = "groceries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    item_name = Column(String(100), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    unit = Column(String(20), default="Pcs", nullable=False)
    category = Column(String(50), default="Others", nullable=False)
    is_completed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
