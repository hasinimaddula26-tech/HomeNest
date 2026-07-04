from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import date, datetime
from enum import Enum

class ReminderType(str, Enum):
    MEDICINE = "Medicine"
    BIRTHDAY = "Birthday"
    BILL = "Bill"
    MEETING = "Meeting"
    SHOPPING = "Shopping"
    MAINTENANCE = "Maintenance"
    CUSTOM = "Custom"
    GENERAL = "General"

class ReminderBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=100, description="Title of the reminder")
    description: Optional[str] = Field(None, description="Detailed description")
    type: ReminderType = Field(default=ReminderType.GENERAL, description="Type of the reminder")
    date: date = Field(..., description="Date for the reminder")
    is_completed: bool = Field(default=False, description="Is the reminder completed?")

class ReminderCreate(ReminderBase):
    pass

class ReminderUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = None
    type: Optional[ReminderType] = None
    date: Optional[date] = None
    is_completed: Optional[bool] = None

class ReminderResponse(ReminderBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
