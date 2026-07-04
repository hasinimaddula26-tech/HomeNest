from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from enum import Enum

class GroceryCategory(str, Enum):
    VEGETABLES = "Vegetables"
    FRUITS = "Fruits"
    DAIRY = "Dairy"
    CLEANING = "Cleaning"
    MEDICINE = "Medicine"
    SNACKS = "Snacks"
    OTHERS = "Others"

class GroceryBase(BaseModel):
    item_name: str = Field(..., min_length=2, max_length=100, description="Name of the grocery item")
    quantity: int = Field(default=1, ge=1, description="Quantity of the item")
    unit: str = Field(default="Pcs", max_length=20, description="Unit of measurement (e.g. Kg, Liters, Pcs)")
    category: GroceryCategory = Field(default=GroceryCategory.OTHERS, description="Category of the grocery item")

class GroceryCreate(GroceryBase):
    pass

class GroceryUpdate(BaseModel):
    item_name: Optional[str] = Field(None, min_length=2, max_length=100)
    quantity: Optional[int] = Field(None, ge=1)
    unit: Optional[str] = Field(None, max_length=20)
    category: Optional[GroceryCategory] = None
    is_completed: Optional[bool] = None

class GroceryResponse(GroceryBase):
    id: int
    is_completed: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
