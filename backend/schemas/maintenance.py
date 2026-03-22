from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class MaintenanceCreate(BaseModel):
    asset_id:       int
    assigned_to:    int
    type:           str
    priority:       str = 'medium'
    title:          str
    description:    str = ''
    scheduled_date: str
    notes:          Optional[str] = ''


class MaintenanceUpdate(BaseModel):
    status:       Optional[str]   = None
    completed_at: Optional[str]   = None
    cost:         Optional[float] = None
    notes:        Optional[str]   = None


class MaintenanceOut(MaintenanceCreate):
    id:            int
    status:        str
    asset_name:    Optional[str] = None
    assigned_name: Optional[str] = None
    completed_at:  Optional[datetime] = None
    cost:          Optional[float]    = None
    created_at:    datetime
    updated_at:    datetime
    model_config = {"from_attributes": True}