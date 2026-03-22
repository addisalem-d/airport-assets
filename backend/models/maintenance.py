from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base


class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"

    id             = Column(Integer, primary_key=True, index=True)
    asset_id       = Column(Integer, ForeignKey("assets.id"),    nullable=False)
    assigned_to    = Column(Integer, ForeignKey("users.id"),     nullable=False)
    type           = Column(String,  nullable=False)
    priority       = Column(String,  default='medium')
    status         = Column(String,  default='scheduled')
    title          = Column(String,  nullable=False)
    description    = Column(String,  default='')
    scheduled_date = Column(String,  nullable=False)
    completed_at   = Column(DateTime(timezone=True), nullable=True)
    cost           = Column(Float,   nullable=True)
    notes          = Column(String,  default='')
    created_at     = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at     = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                            onupdate=lambda: datetime.now(timezone.utc))

    asset    = relationship("Asset", backref="maintenance_logs")
    assignee = relationship("User",  backref="maintenance_logs")
    