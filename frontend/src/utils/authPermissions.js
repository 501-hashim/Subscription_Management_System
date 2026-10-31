/**
 * Authorization and Access Control utilities for Brightloop Subscription Management.
 * 
 * Access Policy:
 * The primary operations and financial dashboard (containing MRR/ARR velocity,
 * sales dendrogram, KPIs, and contract ledger) is RESTRICTED strictly to:
 * 1. System & Operational Administrators (Super Admin, Admin, Billing Manager)
 * 2. Organization Entities & Organization Admins (registered organizations with org_id/company)
 *
 * Regular consumer/individual users and standard customers are restricted from this view.
 */

export function isAuthorizedForDashboard(user) {
  if (!user) return false;

  const roleLower = String(user.role || '').toLowerCase();
  const personaLower = String(user.personaType || '').toLowerCase();
  const accountTypeLower = String(user.accountType || '').toLowerCase();
  const regTypeLower = String(user.registrationType || '').toLowerCase();

  // 1. Administrator roles
  if (
    roleLower.includes('admin') ||
    roleLower === 'super admin' ||
    roleLower === 'billing manager' ||
    roleLower === 'sales representative' ||
    user.department === 'Engineering' ||
    user.department === 'Finance' ||
    user.department === 'Sales' ||
    user.isAdmin === true
  ) {
    return true;
  }

  // 2. Organization roles / entity profiles
  if (
    roleLower === 'organization' ||
    roleLower.includes('org') ||
    personaLower === 'organization' ||
    accountTypeLower === 'organization' ||
    regTypeLower === 'organization' ||
    (typeof user.organization === 'string' && user.organization.trim().length > 0) ||
    Boolean(user.org_id) ||
    user.isOrganization === true
  ) {
    return true;
  }

  // Customer or general standard user -> NOT authorized
  return false;
}

export function getAccessBadgeLabel(user, companySettings = {}) {
  if (!user) return 'Guest';

  const roleLower = String(user.role || '').toLowerCase();
  if (roleLower.includes('admin')) {
    return `Administrator (${user.role || 'Admin'})`;
  }
  if (
    roleLower === 'organization' ||
    user.organization ||
    user.personaType === 'organization'
  ) {
    return `Organization (${user.organization || companySettings.companyName || 'Enterprise Org'})`;
  }
  return user.role || 'Authorized Member';
}
