from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from ..core.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_path = Column(String(255), nullable=False)
    category = Column(String(50), default="Others", nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
