from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class LocationCreate(BaseModel):
    name: str
    code: str
    type: str
    building:    Optional[str] = None
    floor:       Optional[str] = None
    description: Optional[str] = ''


class LocationOut(LocationCreate):
    id:         int
    is_active:  bool
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}