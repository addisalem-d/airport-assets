from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.dependencies import get_db, get_current_user
from models.user import User

router = APIRouter()


@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    total_users  = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()

    users_by_role = (
        db.query(User.role, db.query(User).filter(User.role == User.role).count())
        .group_by(User.role)
        .all()
    )

    return {
        "total_assets":                 0,
        "active_assets":                0,
        "assets_under_maintenance":     0,
        "total_locations":              0,
        "active_users":                 active_users,
        "open_maintenance_tickets":     0,
        "overdue_maintenance":          0,
        "total_asset_value":            0,
        "maintenance_completion_rate":  0,
        "assets_by_category":           [],
        "assets_by_status":             [],
        "maintenance_trend":            [],
        "total_users":                  total_users,
    }
