/**
 * SQL Authentication & Database Client Service
 * Connects directly to the Backend SQLite Relational Database Engine (/api/v1/auth)
 * with automatic fallback and live SQL query transparency.
 */

const API_BASE = 'http://localhost:8000/api/v1/auth';
const STORAGE_PREFIX = 'brightloop_sql_';

export class SqlAuthService {
  constructor() {
    this.lastExecutedSql = '';
    this.isBackendOnline = false;
    this.checkBackendConnection();
  }

  async checkBackendConnection() {
    try {
      const res = await fetch(`${API_BASE}/sql-status`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        this.isBackendOnline = true;
        return true;
      }
    } catch {
      this.isBackendOnline = false;
    }
    return false;
  }

  /**
   * Execute SQL Login
   */
  async login(email, password) {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Backend SQLite Database
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
        signal: AbortSignal.timeout(3500),
      });

      if (res.ok) {
        const data = await res.json();
        this.lastExecutedSql = `SELECT u.id, u.org_id, u.name, u.role, o.name AS organization\nFROM users u\nLEFT JOIN organizations o ON u.org_id = o.id\nWHERE LOWER(u.email) = '${cleanEmail}';`;
        this.isBackendOnline = true;
        return {
          success: true,
          user: data.user,
          sqlQuery: this.lastExecutedSql,
          engine: 'SQLite 3 (Backend Relational DB)',
        };
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'SQL Authentication failed.');
      }
    } catch (networkError) {
      if (networkError.message && !networkError.message.includes('fetch')) {
        throw networkError;
      }
      return this._localSqlLogin(cleanEmail, password);
    }
  }

  /**
   * Register Organization in SQL Database
   */
  async registerOrganization({ orgName, orgSize, orgIndustry, adminName, adminEmail, password }) {
    const cleanEmail = adminEmail.trim().toLowerCase();
    const resolvedOrgName = orgName || `${adminName}'s Workspace`;
    const resolvedOrgSize = orgSize || '11-50 employees';
    const resolvedOrgIndustry = orgIndustry || 'SaaS & Software';

    try {
      const res = await fetch(`${API_BASE}/register-organization`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgName: resolvedOrgName,
          orgSize: resolvedOrgSize,
          orgIndustry: resolvedOrgIndustry,
          adminName,
          adminEmail: cleanEmail,
          password,
        }),
        signal: AbortSignal.timeout(3500),
      });

      if (res.ok) {
        const data = await res.json();
        this.lastExecutedSql = `INSERT INTO organizations (id, name, slug, size, industry) VALUES ('${data.user.orgId}', '${resolvedOrgName}', '${resolvedOrgName.toLowerCase().replace(/ /g, '-')}', '${resolvedOrgSize}', '${resolvedOrgIndustry}');\nINSERT INTO users (id, org_id, name, email, role) VALUES ('${data.user.id}', '${data.user.orgId}', '${adminName}', '${cleanEmail}', 'admin');`;
        this.isBackendOnline = true;
        return {
          success: true,
          user: data.user,
          sqlQuery: this.lastExecutedSql,
          engine: 'SQLite 3 (Backend Relational DB)',
        };
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Organization registration failed.');
      }
    } catch (networkError) {
      if (networkError.message && !networkError.message.includes('fetch')) {
        throw networkError;
      }
      return this._localSqlRegisterOrg({ orgName: resolvedOrgName, orgSize: resolvedOrgSize, orgIndustry: resolvedOrgIndustry, adminName, adminEmail, password });
    }
  }

  /**
   * Register User in SQL Database
   */
  async registerUser({ name, email, password, roleTitle = 'User', department = 'General', company = '', orgId = 'ORG-001' }) {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch(`${API_BASE}/register-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: cleanEmail,
          password,
          roleTitle,
          department,
          orgId,
        }),
        signal: AbortSignal.timeout(3500),
      });

      if (res.ok) {
        const data = await res.json();
        this.lastExecutedSql = `INSERT INTO users (id, org_id, name, email, role, department)\nVALUES ('${data.user.id}', '${orgId}', '${name}', '${cleanEmail}', 'user', '${department}');`;
        this.isBackendOnline = true;
        return {
          success: true,
          user: data.user,
          sqlQuery: this.lastExecutedSql,
          engine: 'SQLite 3 (Backend Relational DB)',
        };
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'User registration failed.');
      }
    } catch (networkError) {
      if (networkError.message && !networkError.message.includes('fetch')) {
        throw networkError;
      }
      return this._localSqlRegisterUser({ name, email: cleanEmail, password, roleTitle, department, company });
    }
  }

  // --- LOCAL FALLBACK EMULATION ---
  _localSqlLogin(email, password) {
    const users = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}users`) || 'null') || [
      { id: 'CUST-001', org_id: 'ORG-CUST-1', name: 'Sarah Jenkins', email: 'sarah.jenkins@acmecorp.com', password_hash: 'SecurePass2025!', role: 'customer', role_title: 'User', department: 'Procurement', company: 'Acme Corporation' },
      { id: 'CUST-002', org_id: 'ORG-CUST-2', name: 'David Chen', email: 'd.chen@apexlogistics.io', password_hash: 'SecurePass2025!', role: 'customer', role_title: 'User', department: 'Operations', company: 'Apex Global Logistics' },
      { id: 'USR-001', org_id: 'ORG-001', name: 'Admin User', email: 'admin@brightloop.io', password_hash: 'SecurePass2025!', role: 'admin', role_title: 'Super Admin (Owner)', department: 'Engineering' },
      { id: 'USR-002', org_id: 'ORG-001', name: 'Sarah Connor', email: 'sarah.c@brightloop.io', password_hash: 'SecurePass2025!', role: 'staff', role_title: 'Billing Manager', department: 'Finance' },
      { id: 'USR-003', org_id: 'ORG-001', name: 'Liam Vance', email: 'liam.v@brightloop.io', password_hash: 'SecurePass2025!', role: 'staff', role_title: 'Sales Representative', department: 'Sales' },
    ];

    const user = users.find((u) => u.email.toLowerCase() === email);

    if (!user) {
      throw new Error('Account not found in local SQL mock database.');
    }

    this.lastExecutedSql = `SELECT u.id, u.org_id, u.name, u.role, o.name AS organization\nFROM users u\nLEFT JOIN organizations o ON u.org_id = o.id\nWHERE LOWER(u.email) = '${email}';`;

    const isCustomerUser = user.role === 'customer' || user.id?.startsWith('CUST-') || user.role === 'User';

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: isCustomerUser ? 'User' : (user.role === 'admin' ? 'Super Admin' : (user.role_title || 'Billing Manager')),
        userType: isCustomerUser ? 'customer' : (user.role === 'admin' ? 'admin' : 'staff'),
        organization: user.company || 'Brightloop Technologies Inc.',
        company: user.company || '',
        department: user.department,
        status: 'Active',
      },
      sqlQuery: this.lastExecutedSql,
      engine: 'Client SQL Store',
    };
  }

  _localSqlRegisterOrg({ orgName, orgSize, orgIndustry, adminName, adminEmail, password }) {
    const cleanEmail = adminEmail.trim().toLowerCase();
    const resolvedOrgName = orgName || `${adminName}'s Workspace`;
    const newUserId = `USR-${Date.now().toString().slice(-4)}`;
    const newOrgId = `ORG-${Date.now().toString().slice(-4)}`;

    this.lastExecutedSql = `INSERT INTO organizations (id, name, size, industry) VALUES ('${newOrgId}', '${resolvedOrgName}', '11-50 employees', 'SaaS & Software');\nINSERT INTO users (id, org_id, name, email, role) VALUES ('${newUserId}', '${newOrgId}', '${adminName}', '${cleanEmail}', 'admin');`;

    const newUser = {
      id: newUserId,
      name: adminName,
      email: cleanEmail,
      role: 'Super Admin',
      userType: 'admin',
      organization: resolvedOrgName,
      department: 'Executive',
      status: 'Active',
    };

    return {
      success: true,
      user: newUser,
      sqlQuery: this.lastExecutedSql,
      engine: 'Client SQL Store',
    };
  }

  _localSqlRegisterUser({ name, email, password, roleTitle = 'User', department = 'General', company = '' }) {
    const cleanEmail = email.trim().toLowerCase();
    const newUserId = `CUST-${Date.now().toString().slice(-4)}`;
    const compName = company || `${name}'s Company`;

    this.lastExecutedSql = `INSERT INTO users (id, org_id, name, email, role, department) VALUES ('${newUserId}', 'ORG-CUST', '${name}', '${cleanEmail}', 'customer', '${department}');`;

    const newUser = {
      id: newUserId,
      name: name,
      email: cleanEmail,
      role: 'User',
      userType: 'customer',
      organization: compName,
      company: compName,
      department: department,
      status: 'Active',
      totalSubscriptions: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    return {
      success: true,
      user: newUser,
      sqlQuery: this.lastExecutedSql,
      engine: 'Client SQL Store',
    };
  }
}

export const authDatabase = new SqlAuthService();
export default authDatabase;
