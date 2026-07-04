from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional
from datetime import date, datetime
from decimal import Decimal
from enum import Enum

class ExpenseCategory(str, Enum):
    FOOD = "Food"
    GROCERIES = "Groceries"
    ELECTRICITY = "Electricity"
    WATER = "Water"
    INTERNET = "Internet"
    FUEL = "Fuel"
    MEDICAL = "Medical"
    EDUCATION = "Education"
    ENTERTAINMENT = "Entertainment"
    SHOPPING = "Shopping"
    RENT = "Rent"
    TRANSPORT = "Transport"
    OTHERS = "Others"

class ExpenseBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=100, description="Title/description of the expense")
    amount: Decimal = Field(..., ge=0.01, description="Amount spent")
    category: ExpenseCategory = Field(default=ExpenseCategory.OTHERS, description="Category of the expense")
    date: date = Field(..., description="Date of the expenditure")
    notes: Optional[str] = Field(None, description="Optional notes")

    @field_validator('title')
    def title_must_not_be_only_numbers(cls, v):
        if v.strip().isdigit():
            raise ValueError('Title cannot consist of numbers only')
        return v

    @field_validator('date')
    def date_cannot_be_in_future(cls, v):
        if v > date.today():
            raise ValueError('Date cannot be in the future')
        return v

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=100)
    amount: Optional[Decimal] = Field(None, ge=0.01)
    category: Optional[ExpenseCategory] = None
    date: Optional[date] = None
    notes: Optional[str] = None

    @field_validator('title')
    def title_must_not_be_only_numbers(cls, v):
        if v is not None and v.strip().isdigit():
            raise ValueError('Title cannot consist of numbers only')
        return v

    @field_validator('date')
    def date_cannot_be_in_future(cls, v):
        if v is not None and v > date.today():
            raise ValueError('Date cannot be in the future')
        return v

class ExpenseResponse(ExpenseBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
        json_encoders={
            Decimal: lambda v: float(v)
        }
    )
