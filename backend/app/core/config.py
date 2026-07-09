import os
from pydantic_settings import BaseSettings
from pydantic import field_validator

class Settings(BaseSettings):
    DATABASE_URL: str = "mysql+pymysql://root:password@localhost:3306/homenest"
    SECRET_KEY: str = "supersecretkeyplaceholder"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        if v.startswith("mysql://"):
            return v.replace("mysql://", "mysql+pymysql://", 1)
        return v

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
