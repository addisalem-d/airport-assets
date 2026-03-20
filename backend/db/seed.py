from db.database import SessionLocal, engine, Base
from models.user import User
from core.security import hash_password


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(User).count() > 0:
        print("Database already seeded.")
        db.close()
        return

    users = [
        User(
            name="Addisalem Admin",
            username="admin",
            email="addisalem11@airport.com",
            hashed_password=hash_password("admin123"),
            role="administrator",
            is_active=True,
            avatar_initials="AA",
        ),
        User(
            name="Manager Test2",
            username="user11",
            email="manager@airport.com",
            hashed_password=hash_password("manager123"),
            role="manager",
            is_active=True,
            avatar_initials="MT",
        ),
        User(
            name="Tester Admin",
            username="test123",
            email="tester@airport.com",
            hashed_password=hash_password("test123"),
            role="administrator",
            is_active=True,
            avatar_initials="TA",
        ),
    ]

    db.add_all(users)
    db.commit()
    db.close()
    print(f"Seeded {len(users)} users.")


if __name__ == "__main__":
    seed()
