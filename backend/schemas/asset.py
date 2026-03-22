from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class AssetCreate(BaseModel):
    name:           str
    serial_number:  str
    category:       str
    status:         str = 'active'
    location_id:    int
    purchase_date:  str
    purchase_price: float = 0
    notes:          Optional[str] = ''


class AssetUpdate(BaseModel):
    name:           Optional[str]   = None
    category:       Optional[str]   = None
    status:         Optional[str]   = None
    location_id:    Optional[int]   = None
    purchase_price: Optional[float] = None
    notes:          Optional[str]   = None
    is_active:      Optional[bool]  = None


class AssetOut(AssetCreate):
    id:            int
    is_active:     bool
    location_name: Optional[str] = None
    created_at:    datetime
    updated_at:    datetime
    model_config = {"from_attributes": True}