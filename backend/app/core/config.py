import os
from typing import List, Optional
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Central application and database configuration.
    Supports local development, testing, and cloud hosting (Render, Neon, Azure, AWS RDS).
    """
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    # Environment
    ENV: str = "development"  # development, testing, production
    DEBUG: bool = True
    APP_NAME: str = "Brightloop Subscription Management System"
    APP_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Security
    SECRET_KEY: str = "brightloop-secret-key-change-in-production-random-token-2026"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    RESEND_API_KEY: Optional[str] = None
    FRONTEND_URL: str = "http://localhost:5173"

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://brightloop.io",
    ]

    # Database Configuration (PostgreSQL primary)
    # Default local PostgreSQL connection string
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/brightloop_subscription_db"

    # Database Connection Pool Settings
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    DB_POOL_TIMEOUT: int = 30
    DB_POOL_RECYCLE: int = 1800  # 30 minutes, critical for hosted PostgreSQL like Neon/Azure
    DB_ECHO: bool = False
    DB_SSL_MODE: Optional[str] = None  # require, verify-ca, verify-full for hosted dbs

    # Odoo Integration
    ODOO_URL: str = "http://localhost:8069"
    ODOO_DB: str = "brightloop_odoo"
    ODOO_USERNAME: str = "admin"
    ODOO_PASSWORD: str = "admin"

    @property
    def is_production(self) -> bool:
        return self.ENV.lower() == "production"

    @property
    def is_testing(self) -> bool:
        return self.ENV.lower() == "testing"

    def get_normalized_database_url(self) -> str:
        """
        Normalize DATABASE_URL for compatibility across local and hosted providers.
        Render and Neon often output 'postgres://' which SQLAlchemy 2.0 requires as
        'postgresql://' or 'postgresql+psycopg2://'.
        """
        url = self.DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+psycopg2://", 1)
        elif url.startswith("postgresql://") and not url.startswith("postgresql+"):
            url = url.replace("postgresql://", "postgresql+psycopg2://", 1)
        return url


settings = Settings()
