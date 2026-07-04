from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from enum import Enum

class DocumentCategory(str, Enum):
    IDENTITY = "Identity"
    MEDICAL = "Medical"
    FINANCIAL = "Financial"
    OTHERS = "Others"

class DocumentBase(BaseModel):
    file_name: str = Field(..., max_length=255)
    file_type: str = Field(..., max_length=50)
    file_path: str = Field(..., max_length=255)
    category: DocumentCategory = Field(default=DocumentCategory.OTHERS)

class DocumentCreate(DocumentBase):
    pass

class DocumentResponse(DocumentBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
