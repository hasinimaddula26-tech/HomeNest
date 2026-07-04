from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import date, datetime
from enum import Enum

class FamilyRelation(str, Enum):
    PARENT = "Parent"
    SPOUSE = "Spouse"
    SIBLING = "Sibling"
    CHILD = "Child"
    GRANDPARENT = "Grandparent"
    OTHERS = "Others"

class BloodGroup(str, Enum):
    A_POS = "A+"
    A_NEG = "A-"
    B_POS = "B+"
    B_NEG = "B-"
    AB_POS = "AB+"
    AB_NEG = "AB-"
    O_POS = "O+"
    O_NEG = "O-"

class FamilyMemberBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    relation: FamilyRelation = Field(default=FamilyRelation.OTHERS)
    blood_group: BloodGroup = Field(default=BloodGroup.O_POS)
    birthday: date
    emergency_contact: str = Field(..., min_length=5, max_length=20)
    photo_url: Optional[str] = Field(None, max_length=255)

class FamilyMemberCreate(FamilyMemberBase):
    pass

class FamilyMemberUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    relation: Optional[FamilyRelation] = None
    blood_group: Optional[BloodGroup] = None
    birthday: Optional[date] = None
    emergency_contact: Optional[str] = Field(None, min_length=5, max_length=20)
    photo_url: Optional[str] = None

class FamilyMemberResponse(FamilyMemberBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
