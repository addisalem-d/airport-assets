from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.dependencies import get_db, get_current_user
from models.location import Location
from models.user import User
from schemas.location import LocationCreate, LocationOut

router = APIRouter()


@router.get("/", response_model=List[LocationOut])
def get_locations(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return db.query(Location).order_by(Location.name).all()


@router.post("/", response_model=LocationOut, status_code=201)
def create_location(payload: LocationCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if db.query(Location).filter(Location.code == payload.code).first():
        raise HTTPException(400, "Code already exists")
    loc = Location(**payload.model_dump())
    db.add(loc); db.commit(); db.refresh(loc)
    return loc