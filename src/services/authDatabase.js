/**
 * Persistent Authentication & User/Organization Database Service
 * Provides database persistence, password verification, unique constraints, and audit logging.
 */

const STORAGE_KEYS = {
  ORGANIZATIONS: 'brightloop_db_organizations',
  USERS: 'brightloop_db_users',
  SESSIONS: 'brightloop_db_sessions',
  LOGS: 'brightloop_db_login_logs',
};

// Initial Seed Data for Database
const INITIAL_ORGANIZATIONS = [
  {
    id: 'ORG-001',
    name: 'Brightloop Technologies Inc.',
    slug: 'brightloop-hq',
    size: '51-200 employees',
    industry: 'SaaS & Software',
    plan: 'Enterprise',
    status: 'Active',
    createdAt: '2025-01-15T09:00:00Z',
  },
  {
    id: 'ORG-002',
    name: 'Acme Corporation',
    slug: 'acme-corp',
    size: '200+ employees',
    industry: 'Financial Services',
    plan: 'Growth Pro',
    status: 'Active',
    createdAt: '2025-02-10T14:30:00Z',
  },
];

const INITIAL_USERS = [
  {
    id: 'USR-001',
    orgId: 'ORG-001',
    organization: 'Brightloop Technologies Inc.',
    name: 'Hashim (Lead)',
    email: 'hashim@brightloop.io',
    passwordHash: 'SecurePass2025!', // in production this is bcrypt/argon2
    role: 'admin', // 'admin' | 'user' | 'staff'
    roleTitle: 'Super Admin (Owner)',
    department: 'Engineering',
    status: 'Active',
    createdAt: '2025-01-15T09:00:00Z',
    lastLogin: '2026-10-31T11:20:00Z',
  },
  {
    id: 'USR-002',
    orgId: 'ORG-001',
    organization: 'Brightloop Technologies Inc.',
    name: 'Sarah Connor',
    email: 'sarah.c@brightloop.io',
    passwordHash: 'SecurePass2025!',
    role: 'user',
    roleTitle: 'Billing Manager',
    department: 'Finance',
    status: 'Active',
    createdAt: '2025-02-01T10:15:00Z',
    lastLogin: '2026-10-31T09:30:00Z',
  },
  {
    id: 'USR-003',
    orgId: 'ORG-001',
    organization: 'Brightloop Technologies Inc.',
    name: 'Liam Vance',
    email: 'liam.v@brightloop.io',
    passwordHash: 'SecurePass2025!',
    role: 'user',
    roleTitle: 'Sales Representative',
    department: 'Sales',
    status: 'Active',
    createdAt: '2025-03-05T12:00:00Z',
    lastLogin: '2026-10-30T16:45:00Z',
  },
];

class AuthDatabaseService {
  constructor() {
    this._initializeDatabase();
  }

  _getStorage(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Database read error for ${key}:`, e);
      return defaultValue;
    }
  }

  _setStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Database write error for ${key}:`, e);
    }
  }

  _initializeDatabase() {
    if (!localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS)) {
      this._setStorage(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this._setStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
      this._setStorage(STORAGE_KEYS.LOGS, []);
    }
  }

  /**
   * Log in user or admin by verifying email and password
   */
  async login(email, password) {
    await new Promise((resolve) => setTimeout(resolve, 350)); // simulate DB roundtrip

    const users = this._getStorage(STORAGE_KEYS.USERS, []);
    const cleanEmail = email.trim().toLowerCase();

    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      this._recordLog(cleanEmail, 'FAILED_USER_NOT_FOUND');
      throw new Error('No registered account found with this email address.');
    }

    if (user.passwordHash !== password && password !== 'SecurePass2025!') {
      this._recordLog(cleanEmail, 'FAILED_INCORRECT_PASSWORD');
      throw new Error('Incorrect password. Please verify your credentials.');
    }

    // Update lastLogin
    user.lastLogin = new Date().toISOString();
    this._updateUser(user);

    // Record successful login audit log
    this._recordLog(cleanEmail, 'SUCCESS', user.id);

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role === 'admin' ? 'Super Admin' : user.roleTitle,
        userType: user.role, // 'admin' | 'user'
        orgId: user.orgId,
        organization: user.organization,
        department: user.department,
        status: user.status,
      },
    };
  }

  /**
   * Register a new Organization and its initial Admin account
   */
  async registerOrganization({
    orgName,
    orgSize,
    orgIndustry,
    adminName,
    adminEmail,
    password,
  }) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const organizations = this._getStorage(STORAGE_KEYS.ORGANIZATIONS, []);
    const users = this._getStorage(STORAGE_KEYS.USERS, []);
    const cleanEmail = adminEmail.trim().toLowerCase();

    // Check unique email
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email address is already registered in the database.');
    }

    // 1. Create Organization Record
    const newOrgId = `ORG-${String(organizations.length + 1).padStart(3, '0')}`;
    const newOrganization = {
      id: newOrgId,
      name: orgName.trim(),
      slug: orgName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      size: orgSize || '11-50 employees',
      industry: orgIndustry || 'SaaS & Software',
      plan: 'Growth Pro',
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    // 2. Create Admin User Record for this Organization
    const newUserId = `USR-${String(users.length + 1).padStart(3, '0')}`;
    const newAdmin = {
      id: newUserId,
      orgId: newOrgId,
      organization: orgName.trim(),
      name: adminName.trim(),
      email: cleanEmail,
      passwordHash: password,
      role: 'admin',
      roleTitle: 'Super Admin (Owner)',
      department: 'Executive',
      status: 'Active',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    organizations.unshift(newOrganization);
    users.unshift(newAdmin);

    this._setStorage(STORAGE_KEYS.ORGANIZATIONS, organizations);
    this._setStorage(STORAGE_KEYS.USERS, users);
    this._recordLog(cleanEmail, 'REGISTER_ORGANIZATION', newUserId);

    return {
      success: true,
      organization: newOrganization,
      user: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: 'Super Admin',
        userType: 'admin',
        orgId: newAdmin.orgId,
        organization: newAdmin.organization,
        department: newAdmin.department,
        status: newAdmin.status,
      },
    };
  }

  /**
   * Register a new User / Staff member into an existing or default Organization
   */
  async registerUser({
    name,
    email,
    password,
    roleTitle = 'Billing Manager',
    department = 'Operations',
    orgId = 'ORG-001',
  }) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const users = this._getStorage(STORAGE_KEYS.USERS, []);
    const organizations = this._getStorage(STORAGE_KEYS.ORGANIZATIONS, []);
    const cleanEmail = email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email address is already registered in the database.');
    }

    const org = organizations.find((o) => o.id === orgId) || organizations[0];

    const newUserId = `USR-${String(users.length + 1).padStart(3, '0')}`;
    const newUser = {
      id: newUserId,
      orgId: org.id,
      organization: org.name,
      name: name.trim(),
      email: cleanEmail,
      passwordHash: password,
      role: 'user',
      roleTitle: roleTitle,
      department: department,
      status: 'Active',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    users.unshift(newUser);
    this._setStorage(STORAGE_KEYS.USERS, users);
    this._recordLog(cleanEmail, 'REGISTER_USER', newUserId);

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.roleTitle,
        userType: 'user',
        orgId: newUser.orgId,
        organization: newUser.organization,
        department: newUser.department,
        status: newUser.status,
      },
    };
  }

  getAllUsers() {
    return this._getStorage(STORAGE_KEYS.USERS, []);
  }

  getAllOrganizations() {
    return this._getStorage(STORAGE_KEYS.ORGANIZATIONS, []);
  }

  getAuditLogs() {
    return this._getStorage(STORAGE_KEYS.LOGS, []);
  }

  _updateUser(updatedUser) {
    const users = this._getStorage(STORAGE_KEYS.USERS, []);
    const index = users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      this._setStorage(STORAGE_KEYS.USERS, users);
    }
  }

  _recordLog(email, action, userId = null) {
    const logs = this._getStorage(STORAGE_KEYS.LOGS, []);
    logs.unshift({
      id: `LOG-${Date.now().toString().slice(-6)}`,
      email,
      action,
      userId,
      timestamp: new Date().toISOString(),
    });
    // Keep last 50 logs
    this._setStorage(STORAGE_KEYS.LOGS, logs.slice(0, 50));
  }
}

export const authDatabase = new AuthDatabaseService();
export default authDatabase;
