from contextlib import asynccontextmanager
from random import seed
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.database import engine, Base
from routers import users, auth, dashboard, locations, asset, maintenance



@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    try:
        seed()
        print("Database seeded successfully")
    except Exception as e:
        print(f" Error while seeding data: {e}")
    yield


app = FastAPI(
    title="Airport Assets API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,      prefix="/auth",      tags=["auth"])
app.include_router(users.router,     prefix="/users",     tags=["users"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
app.include_router(locations.router, prefix="/locations", tags=["locations"])
app.include_router(asset.router, prefix="/assets", tags=["assets"])
app.include_router(maintenance.router, prefix="/maintenance", tags=["maintenance"])






@app.get("/health")
def health():
    return {"status": "ok"}
