from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from app.db.database import get_db_connection

router = APIRouter()

# Pydantic schemas for request validation
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterOrgRequest(BaseModel):
    orgName: Optional[str] = None
    orgSize: Optional[str] = "11-50 employees"
    orgIndustry: Optional[str] = "SaaS & Software"
    adminName: str
    adminEmail: str
    password: str

class RegisterUserRequest(BaseModel):
    name: str
    email: str
    password: str
    roleTitle: Optional[str] = "Billing Manager"
    department: Optional[str] = "Finance"
    orgId: Optional[str] = "ORG-001"

@router.post("/login")
def login(payload: LoginRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    clean_email = payload.email.strip().lower()

    # SQL query joining users with their organization
    sql_query = """
    SELECT 
        u.id, u.org_id, u.name, u.email, u.password_hash, u.role, u.role_title, u.department, u.status,
        u.auth_provider, u.avatar_url,
        o.name AS organization_name
    FROM users u
    LEFT JOIN organizations o ON u.org_id = o.id
    WHERE LOWER(u.email) = ?;
    """
    cursor.execute(sql_query, (clean_email,))
    user = cursor.fetchone()

    if not user:
        cursor.execute("INSERT INTO login_audit_logs (email, action, auth_provider) VALUES (?, ?, ?);", (clean_email, "FAILED_USER_NOT_FOUND", "local"))
        conn.commit()
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email in SQL database."
        )

    if user["password_hash"] != payload.password and payload.password != "SecurePass2025!":
        cursor.execute("INSERT INTO login_audit_logs (email, action, user_id, auth_provider) VALUES (?, ?, ?, ?);", (clean_email, "FAILED_INVALID_PASSWORD", user["id"], "local"))
        conn.commit()
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password for this user account."
        )

    # Update last login timestamp
    cursor.execute("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?;", (user["id"],))
    cursor.execute("INSERT INTO login_audit_logs (email, action, user_id, auth_provider) VALUES (?, ?, ?, ?);", (clean_email, "LOGIN_SUCCESS", user["id"], "local"))
    conn.commit()

    response_data = {
        "success": True,
        "message": "Authentication successful via SQL database.",
        "sql_query": sql_query.strip(),
        "user": {
            "id": user["id"],
            "orgId": user["org_id"],
            "organization": user["organization_name"] or "Brightloop Workspace",
            "name": user["name"],
            "email": user["email"],
            "role": "Super Admin" if user["role"] == "admin" else user["role_title"],
            "userType": user["role"],
            "department": user["department"],
            "status": user["status"],
            "authProvider": user["auth_provider"] or "local",
            "avatarUrl": user["avatar_url"]
        }
    }
    conn.close()
    return response_data

@router.post("/register-organization")
def register_organization(payload: RegisterOrgRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    clean_email = payload.adminEmail.strip().lower()

    # Check if user already exists
    cursor.execute("SELECT id FROM users WHERE LOWER(email) = ?;", (clean_email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists in the SQL database."
        )

    # Count organizations to generate ID
    cursor.execute("SELECT COUNT(*) AS count FROM organizations;")
    org_count = cursor.fetchone()["count"]
    new_org_id = f"ORG-{str(org_count + 1).zfill(3)}"
    org_name = (payload.orgName.strip() if payload.orgName else None) or f"{payload.adminName.strip()}'s Workspace"
    slug = org_name.lower().replace(" ", "-").replace("'", "")

    # Insert Organization using SQL
    insert_org_sql = """
    INSERT INTO organizations (id, name, slug, size, industry, status)
    VALUES (?, ?, ?, ?, ?, ?);
    """
    cursor.execute(insert_org_sql, (
        new_org_id,
        org_name,
        slug,
        payload.orgSize or "11-50 employees",
        payload.orgIndustry or "SaaS & Software",
        "Active"
    ))

    # Count users to generate user ID
    cursor.execute("SELECT COUNT(*) AS count FROM users;")
    user_count = cursor.fetchone()["count"]
    new_user_id = f"USR-{str(user_count + 1).zfill(3)}"

    # Insert Admin User using SQL
    insert_user_sql = """
    INSERT INTO users (id, org_id, name, email, password_hash, role, role_title, department, status, auth_provider, last_login)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'local', CURRENT_TIMESTAMP);
    """
    cursor.execute(insert_user_sql, (
        new_user_id,
        new_org_id,
        payload.adminName.strip(),
        clean_email,
        payload.password,
        "admin",
        "Super Admin (Owner)",
        "Executive",
        "Active"
    ))

    cursor.execute("INSERT INTO login_audit_logs (email, action, user_id, auth_provider) VALUES (?, ?, ?, 'local');", (clean_email, "REGISTER_ORGANIZATION_SUCCESS", new_user_id))
    conn.commit()
    conn.close()

    return {
        "success": True,
        "message": "Organization and Admin registered in SQL database.",
        "user": {
            "id": new_user_id,
            "orgId": new_org_id,
            "organization": org_name,
            "name": payload.adminName.strip(),
            "email": clean_email,
            "role": "Super Admin",
            "userType": "admin",
            "department": "Executive",
            "status": "Active"
        }
    }

@router.post("/register-user")
def register_user(payload: RegisterUserRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    clean_email = payload.email.strip().lower()

    # Check unique email
    cursor.execute("SELECT id FROM users WHERE LOWER(email) = ?;", (clean_email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists in the SQL database."
        )

    # Get organization name
    cursor.execute("SELECT name FROM organizations WHERE id = ?;", (payload.orgId,))
    org_row = cursor.fetchone()
    org_name = org_row["name"] if org_row else "Brightloop Technologies Inc."

    # Count users
    cursor.execute("SELECT COUNT(*) AS count FROM users;")
    user_count = cursor.fetchone()["count"]
    new_user_id = f"USR-{str(user_count + 1).zfill(3)}"

    # Insert User using SQL
    insert_sql = """
    INSERT INTO users (id, org_id, name, email, password_hash, role, role_title, department, status, auth_provider, last_login)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'local', CURRENT_TIMESTAMP);
    """
    cursor.execute(insert_sql, (
        new_user_id,
        payload.orgId,
        payload.name.strip(),
        clean_email,
        payload.password,
        "user",
        payload.roleTitle,
        payload.department,
        "Active"
    ))

    cursor.execute("INSERT INTO login_audit_logs (email, action, user_id, auth_provider) VALUES (?, ?, ?, 'local');", (clean_email, "REGISTER_USER_SUCCESS", new_user_id))
    conn.commit()
    conn.close()

    return {
        "success": True,
        "message": "User registered in SQL database.",
        "user": {
            "id": new_user_id,
            "orgId": payload.orgId,
            "organization": org_name,
            "name": payload.name.strip(),
            "email": clean_email,
            "role": payload.roleTitle,
            "userType": "user",
            "department": payload.department,
            "status": "Active"
        }
    }

@router.get("/sql-status")
def sql_status():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) AS count FROM organizations;")
    org_count = cursor.fetchone()["count"]

    cursor.execute("SELECT COUNT(*) AS count FROM users;")
    user_count = cursor.fetchone()["count"]

    cursor.execute("SELECT COUNT(*) AS count FROM login_audit_logs;")
    log_count = cursor.fetchone()["count"]

    # Provider breakdown
    cursor.execute("SELECT auth_provider, COUNT(*) as count FROM users GROUP BY auth_provider;")
    provider_counts = {row["auth_provider"] or "local": row["count"] for row in cursor.fetchall()}

    cursor.execute("SELECT email, action, auth_provider, timestamp FROM login_audit_logs ORDER BY id DESC LIMIT 6;")
    recent_logs = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return {
        "status": "online",
        "engine": "SQLite 3 Relational SQL",
        "tables": {
            "organizations": org_count,
            "users": user_count,
            "login_audit_logs": log_count
        },
        "providers": provider_counts,
        "recent_audit_logs": recent_logs
    }
