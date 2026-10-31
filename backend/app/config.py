import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "Brightloop Subscription Management API"
    APP_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security & CORS
    SECRET_KEY: str = os.getenv("SECRET_KEY", "brightloop-secret-key-change-in-production")
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "*"
    ]
    
    # Odoo Integration Settings (XML-RPC)
    ODOO_URL: str = os.getenv("ODOO_URL", "http://localhost:8069")
    ODOO_DB: str = os.getenv("ODOO_DB", "brightloop_odoo")
    ODOO_USERNAME: str = os.getenv("ODOO_USERNAME", "admin")
    ODOO_PASSWORD: str = os.getenv("ODOO_PASSWORD", "admin")

settings = Settings()
