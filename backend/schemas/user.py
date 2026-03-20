from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    name:     str
    username: str
    email:    EmailStr
    role:     str = "manager"


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name:      Optional[str]   = None
    email:     Optional[EmailStr] = None
    role:      Optional[str]   = None
    is_active: Optional[bool]  = None


class UserOut(UserBase):
    id:               int
    is_active:        bool
    avatar_initials:  str
    last_login:       Optional[datetime] = None
    created_at:       datetime
    updated_at:       datetime

    model_config = {"from_attributes": True}


class TokenOut(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    user:         UserOut


class LoginIn(BaseModel):
    username: str
    password: str


