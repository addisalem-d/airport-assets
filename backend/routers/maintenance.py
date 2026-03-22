from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.dependencies import get_db, get_current_user
from models.maintenance import MaintenanceLog
from models.user import User
from schemas.maintenance import MaintenanceCreate, MaintenanceUpdate, MaintenanceOut

router = APIRouter()


@router.get("/", response_model=List[MaintenanceOut])
def get_logs(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    logs = db.query(MaintenanceLog).order_by(MaintenanceLog.scheduled_date).all()
    result = []
    for log in logs:
        out = MaintenanceOut.model_validate(log)
        out.asset_name    = log.asset.name    if log.asset    else None
        out.assigned_name = log.assignee.name if log.assignee else None
        result.append(out)
    return result


@router.post("/", response_model=MaintenanceOut, status_code=201)
def create_log(payload: MaintenanceCreate, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    log = MaintenanceLog(**payload.model_dump())
    db.add(log); db.commit(); db.refresh(log)
    return log


@router.patch("/{log_id}", response_model=MaintenanceOut)
def update_log(log_id: int, payload: MaintenanceUpdate, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    log = db.query(MaintenanceLog).filter(MaintenanceLog.id == log_id).first()
    if not log:
        raise HTTPException(404, "Ticket not found")
    for k, v in payload.model_dump(exclude_none=True).items():
        setattr(log, k, v)
    db.commit(); db.refresh(log)
    return log