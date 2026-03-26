from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from core.dependencies import get_db, get_current_user
from models.user import User
from models.asset import Asset
from models.maintenance import MaintenanceLog
from models.location import Location

router = APIRouter()


@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    total_assets             = db.query(Asset).count()
    active_assets            = db.query(Asset).filter(Asset.status == 'active').count()
    under_maintenance        = db.query(Asset).filter(Asset.status == 'maintenance').count()
    active_users             = db.query(User).filter(User.is_active == True).count()
    open_tickets             = db.query(MaintenanceLog).filter(MaintenanceLog.status.in_(['scheduled', 'in_progress', 'overdue'])).count()
    overdue                  = db.query(MaintenanceLog).filter(MaintenanceLog.status == 'overdue').count()
    completed                = db.query(MaintenanceLog).filter(MaintenanceLog.status == 'completed').count()
    total_tickets            = db.query(MaintenanceLog).count()
    completion_rate          = round((completed / total_tickets) * 100) if total_tickets > 0 else 0
    total_value              = db.query(func.sum(Asset.purchase_price)).scalar() or 0

    by_category = db.query(Asset.category, func.count(Asset.id)).group_by(Asset.category).all()
    by_status   = db.query(Asset.status,   func.count(Asset.id)).group_by(Asset.status).all()

    return {
        "total_assets":                total_assets,
        "active_assets":               active_assets,
        "assets_under_maintenance":    under_maintenance,
        "total_locations":             db.query(Location).count(),     
        #   "total_locations": db.query(Location).filter(Location.is_active == True).count(),  if I want to count only active locations
        "active_users":                active_users,
        "open_maintenance_tickets":    open_tickets,
        "overdue_maintenance":         overdue,
        "total_asset_value":           total_value,
        "maintenance_completion_rate": completion_rate,
        "assets_by_category":          [{ "category": c, "count": n } for c, n in by_category],
        "assets_by_status":            [{ "status": s,   "count": n } for s, n in by_status],
        "maintenance_trend":           [],
        "total_users":                 db.query(User).count(),
    }
