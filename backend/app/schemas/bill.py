from pydantic import BaseModel, Field, ConfigDict, computed_field
from typing import Optional
from datetime import date, datetime
from decimal import Decimal
from enum import Enum

class BillCategory(str, Enum):
    ELECTRICITY = "Electricity"
    WATER = "Water"
    INTERNET = "Internet"
    GAS = "Gas"
    RENT = "Rent"
    OTHERS = "Others"

class BillBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=100, description="Title of the bill")
    amount: Decimal = Field(..., ge=0.01, description="Bill amount")
    category: BillCategory = Field(default=BillCategory.OTHERS, description="Category of the bill")
    due_date: date = Field(..., description="Due date of the bill")
    is_paid: bool = Field(default=False, description="Is the bill paid?")

class BillCreate(BillBase):
    pass

class BillUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=100)
    amount: Optional[Decimal] = Field(None, ge=0.01)
    category: Optional[BillCategory] = None
    due_date: Optional[date] = None
    is_paid: Optional[bool] = None

class BillResponse(BillBase):
    id: int
    created_at: datetime

    @computed_field
    @property
    def status(self) -> str:
        if self.is_paid:
            return "Paid"
        elif self.due_date < date.today():
            return "Overdue"
        else:
            return "Pending"

    model_config = ConfigDict(
        from_attributes=True,
        json_encoders={
            Decimal: lambda v: float(v)
        }
    )
