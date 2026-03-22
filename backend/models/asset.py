from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base


class Asset(Base):
    __tablename__ = "assets"

    id             = Column(Integer, primary_key=True, index=True)
    name           = Column(String,  nullable=False)
    serial_number  = Column(String,  unique=True, index=True, nullable=False)
    category       = Column(String,  nullable=False)
    status         = Column(String,  default='active')
    location_id    = Column(Integer, ForeignKey("locations.id"), nullable=False)
    purchase_date  = Column(String,  nullable=False)
    purchase_price = Column(Float,   default=0)
    notes          = Column(String,  default='')
    is_active      = Column(Boolean, default=True)
    created_at     = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at     = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                            onupdate=lambda: datetime.now(timezone.utc))

    location = relationship("Location", backref="assets")