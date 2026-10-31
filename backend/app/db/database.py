import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "subscriptions_auth.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Organizations Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS organizations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        size TEXT,
        industry TEXT,
        plan TEXT DEFAULT 'Growth Pro',
        status TEXT DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. Users & Admins Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        org_id TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT DEFAULT 'OAuth-Google-Secured',
        role TEXT NOT NULL DEFAULT 'user',
        role_title TEXT DEFAULT 'Member',
        department TEXT DEFAULT 'Operations',
        status TEXT DEFAULT 'Active',
        auth_provider TEXT DEFAULT 'local',
        google_id TEXT,
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        FOREIGN KEY (org_id) REFERENCES organizations(id)
    );
    """)

    # 3. Login Audit Logs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS login_audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        action TEXT NOT NULL,
        user_id TEXT,
        ip_address TEXT,
        auth_provider TEXT DEFAULT 'local',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Schema migration check for existing tables
    cursor.execute("PRAGMA table_info(users);")
    existing_cols = [row["name"] for row in cursor.fetchall()]
    if "auth_provider" not in existing_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN auth_provider TEXT DEFAULT 'local';")
    if "google_id" not in existing_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN google_id TEXT;")
    if "avatar_url" not in existing_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN avatar_url TEXT;")

    cursor.execute("PRAGMA table_info(login_audit_logs);")
    existing_log_cols = [row["name"] for row in cursor.fetchall()]
    if "auth_provider" not in existing_log_cols:
        cursor.execute("ALTER TABLE login_audit_logs ADD COLUMN auth_provider TEXT DEFAULT 'local';")

    # Check if initial data already exists
    cursor.execute("SELECT COUNT(*) as count FROM organizations;")
    org_count = cursor.fetchone()["count"]

    if org_count == 0:
        # Seed Organizations
        cursor.execute("""
        INSERT INTO organizations (id, name, slug, size, industry, plan, status)
        VALUES 
            ('ORG-001', 'Brightloop Technologies Inc.', 'brightloop-tech', '51-200 employees', 'SaaS & Software', 'Enterprise', 'Active'),
            ('ORG-002', 'Acme Corporation', 'acme-corp', '200+ employees', 'Financial Services', 'Growth Pro', 'Active');
        """)

        # Seed Users
        cursor.execute("""
        INSERT INTO users (id, org_id, name, email, password_hash, role, role_title, department, status, auth_provider, google_id, last_login)
        VALUES
            ('USR-001', 'ORG-001', 'Hashim (Lead)', 'hashim@brightloop.io', 'SecurePass2025!', 'admin', 'Super Admin (Owner)', 'Engineering', 'Active', 'local', 'goog-hashim-101', CURRENT_TIMESTAMP),
            ('USR-002', 'ORG-001', 'Sarah Connor', 'sarah.c@brightloop.io', 'SecurePass2025!', 'user', 'Billing Manager', 'Finance', 'Active', 'local', 'goog-sarah-102', CURRENT_TIMESTAMP),
            ('USR-003', 'ORG-001', 'Liam Vance', 'liam.v@brightloop.io', 'SecurePass2025!', 'user', 'Sales Representative', 'Sales', 'Active', 'local', 'goog-liam-103', CURRENT_TIMESTAMP);
        """)

        # Seed initial log
        cursor.execute("""
        INSERT INTO login_audit_logs (email, action, user_id, auth_provider)
        VALUES ('hashim@brightloop.io', 'SYSTEM_INITIALIZATION_SEED', 'USR-001', 'system');
        """)

    conn.commit()
    conn.close()

# Auto-initialize on module load
init_db()
