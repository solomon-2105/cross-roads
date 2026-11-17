from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    API_PREFIX: str = "/api"
    DEBUG: bool = False

    # SQLite only. Example for a mounted volume: sqlite:////data/database.db
    DATABASE_URL: str = "sqlite:///./database.db"

    # Comma-separated frontend origins, no trailing slash.
    ALLOWED_ORIGINS: str = ""

    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-3.5-flash-lite"

    # Rate limiting for POST /stories/create
    RATE_LIMIT_PER_IP_MAX: int = 5
    RATE_LIMIT_PER_IP_WINDOW_SECONDS: int = 3600
    RATE_LIMIT_GLOBAL_MAX: int = 100
    RATE_LIMIT_GLOBAL_WINDOW_SECONDS: int = 86400

    @property
    def cors_origins(self) -> List[str]:
        return [
            origin.strip().rstrip("/")
            for origin in self.ALLOWED_ORIGINS.split(",")
            if origin.strip()
        ]


settings = Settings()