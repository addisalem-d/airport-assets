from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.database import engine, Base
from routers import users, auth, dashboard


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
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


@app.get("/health")
def health():
    return {"status": "ok"}
