from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from db.database import Base


class Location(Base):
    __tablename__ = "locations"
    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String,  nullable=False)
    code        = Column(String,  unique=True, index=True, nullable=False)
    type        = Column(String,  nullable=False)
    building    = Column(String,  nullable=True)
    floor       = Column(String,  nullable=True)
    description = Column(String,  default='')
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at  = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))