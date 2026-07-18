from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class ActivityResponse(BaseModel):
    id: int
    user_id: Optional[int]
    activity_type: str
    message: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
