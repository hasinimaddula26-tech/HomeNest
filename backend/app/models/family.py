from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, func
from ..core.database import Base

class FamilyMember(Base):
    __tablename__ = "family_members"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    relation = Column(String(50), nullable=False)
    blood_group = Column(String(5), nullable=False)
    birthday = Column(Date, nullable=False)
    emergency_contact = Column(String(20), nullable=False)
    photo_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
