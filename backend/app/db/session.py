import logging
from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool, NullPool, StaticPool
from app.core.config import settings

logger = logging.getLogger(__name__)

normalized_url = settings.get_normalized_database_url()

# Configure engine connection parameters based on dialect & environment
connect_args = {}
poolclass = QueuePool

if normalized_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    poolclass = StaticPool if ":memory:" in normalized_url else NullPool
else:
    # PostgreSQL configuration
    if settings.DB_SSL_MODE:
        connect_args["sslmode"] = settings.DB_SSL_MODE

engine_kwargs = {
    "echo": settings.DB_ECHO,
    "connect_args": connect_args,
}

if not normalized_url.startswith("sqlite"):
    engine_kwargs.update({
        "poolclass": poolclass,
        "pool_size": settings.DB_POOL_SIZE,
        "max_overflow": settings.DB_MAX_OVERFLOW,
        "pool_timeout": settings.DB_POOL_TIMEOUT,
        "pool_recycle": settings.DB_POOL_RECYCLE,
        "pool_pre_ping": True,  # Critical for detecting disconnected cloud PostgreSQL connections
    })

engine = create_engine(normalized_url, **engine_kwargs)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,  # Ensures attributes remain accessible after commit
)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency for database session lifecycle management.
    Guarantees session cleanup and automatic rollback on unhandled exceptions.
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Database transaction error: {e}", exc_info=True)
        raise
    finally:
        db.close()


def check_db_connection() -> dict:
    """
    Executes a health check query against the database.
    Returns status dict with latency/version info.
    """
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1")).scalar()
            return {
                "status": "healthy",
                "connected": result == 1,
                "database_url_dialect": engine.dialect.name,
            }
    except Exception as e:
        logger.error(f"Database healthcheck failed: {e}")
        return {
            "status": "unhealthy",
            "connected": False,
            "error": str(e),
            "database_url_dialect": engine.dialect.name,
        }
