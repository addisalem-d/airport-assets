from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://admin:secret@db:5432/airport_assets"
    SECRET_KEY: str   = "change-me-in-production"
    ALGORITHM: str    = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    class Config:
        env_file = ".env"


settings = Settings()
