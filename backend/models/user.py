
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from db.database import Base


class User(Base):
    __tablename__ = "users"

    id               = Column(Integer, primary_key=True, index=True)
    name             = Column(String,  nullable=False)
    username         = Column(String,  unique=True, index=True, nullable=False)
    email            = Column(String,  unique=True, index=True, nullable=False)
    hashed_password  = Column(String,  nullable=False)
    role             = Column(String,  default="manager")
    is_active        = Column(Boolean, default=True)
    avatar_initials  = Column(String,  default="")
    last_login       = Column(DateTime(timezone=True), nullable=True)
    created_at       = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at       = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                              onupdate=lambda: datetime.now(timezone.utc))
