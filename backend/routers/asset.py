from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.dependencies import get_db, get_current_user
from models.asset import Asset
from models.user import User
from schemas.asset import AssetCreate, AssetUpdate, AssetOut

router = APIRouter()


@router.get("/", response_model=List[AssetOut])
def get_assets(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    assets = db.query(Asset).order_by(Asset.name).all()
    result = []
    for a in assets:
        out = AssetOut.model_validate(a)
        out.location_name = a.location.name if a.location else None
        result.append(out)
    return result


@router.post("/", response_model=AssetOut, status_code=201)
def create_asset(payload: AssetCreate, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    if db.query(Asset).filter(Asset.serial_number == payload.serial_number).first():
        raise HTTPException(400, "Serial number already exists")
    asset = Asset(**payload.model_dump())
    db.add(asset); db.commit(); db.refresh(asset)
    return asset


@router.patch("/{asset_id}", response_model=AssetOut)
def update_asset(asset_id: int, payload: AssetUpdate, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(404, "Asset not found")
    for k, v in payload.model_dump(exclude_none=True).items():
        setattr(asset, k, v)
    db.commit(); db.refresh(asset)
    return asset


@router.delete("/{asset_id}", status_code=204)
def delete_asset(asset_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(404, "Asset not found")
    db.delete(asset); db.commit()