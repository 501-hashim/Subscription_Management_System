import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Users, 
  ShieldCheck, 
  Key, 
  Check, 
  Save, 
  Plus, 
  Mail, 
  Globe 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export function SettingsPage({ companySettings, users, isAdmin = true, onSaveCompanySettings, onAddUser }) {
  const [activeTab, setActiveTab] = useState('company'); // 'company', 'profile', 'users', 'roles'
  const [companyForm, setCompanyForm] = useState(companySettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Invite User state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'Billing Manager',
    department: 'Finance',
  });

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    onSaveCompanySettings(companyForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.email) return;

    const newUser = {
      id: `USR-${String(users.length + 1).padStart(2, '0')}`,
      ...inviteForm,
      status: 'Active',
      lastActive: 'Invited just now',
    };

    onAddUser(newUser);
    setIsInviteModalOpen(false);
    setInviteForm({ name: '', email: '', role: 'Billing Manager', department: 'Finance' });
  };

  const tabs = [
    { id: 'company', label: 'Company Information', icon: Building2 },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'roles', label: 'Roles & Permissions', icon: ShieldCheck },
  ];

  const roleMatrix = [
    { module: 'Dashboard & Financial KPIs', superAdmin: 'Full Access', billingManager: 'Full Access', salesRep: 'View Only', supportLead: 'No Access' },
    { module: 'Customers Directory', superAdmin: 'Full Access', billingManager: 'Full Access', salesRep: 'Full Access', supportLead: 'View Only' },
    { module: 'Products & Subscription Plans', superAdmin: 'Full Access', billingManager: 'Edit / View', salesRep: 'View Only', supportLead: 'View Only' },
    { module: 'Quotations Management', superAdmin: 'Full Access', billingManager: 'Full Access', salesRep: 'Create / View', supportLead: 'No Access' },
    { module: 'Subscriptions & Renewals', superAdmin: 'Full Access', billingManager: 'Full Access', salesRep: 'View Only', supportLead: 'View Only' },
    { module: 'Invoices & Invoicing Engine', superAdmin: 'Full Access', billingManager: 'Full Access', salesRep: 'View Only', supportLead: 'View Only' },
    { module: 'Payments & Gateway Config', superAdmin: 'Full Access', billingManager: 'Full Access', salesRep: 'No Access', supportLead: 'No Access' },
    { module: 'Company & Security Settings', superAdmin: 'Full Access', billingManager: 'No Access', salesRep: 'No Access', supportLead: 'No Access' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-slate-900">System & Organization Settings</h1>
        <p className="text-xs text-slate-500">Manage Brightloop legal identity, team credentials, and role privileges.</p>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 gap-6 text-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 font-semibold border-b-2 transition-all ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" /> Settings updated successfully!
        </div>
      )}

      {/* Tab: Company Information */}
      {activeTab === 'company' && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Company Details & Billing Defaults</CardTitle>
              <CardDescription>Displayed on customer invoices, quotations, and official receipts.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCompanySubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Company Trading Name</label>
                  <input
                    type="text"
                    value={companyForm.companyName}
                    onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Legal Registered Entity Name</label>
                  <input
                    type="text"
                    value={companyForm.legalName}
                    onChange={(e) => setCompanyForm({ ...companyForm, legalName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tax ID / EIN</label>
                  <input
                    type="text"
                    value={companyForm.taxId}
                    onChange={(e) => setCompanyForm({ ...companyForm, taxId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Base Currency</label>
                  <input
                    type="text"
                    value={companyForm.currency}
                    onChange={(e) => setCompanyForm({ ...companyForm, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">VAT / Sales Tax Rate</label>
                  <input
                    type="text"
                    value={companyForm.vatRate}
                    onChange={(e) => setCompanyForm({ ...companyForm, vatRate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Billing Support Email</label>
                  <input
                    type="email"
                    value={companyForm.supportEmail}
                    onChange={(e) => setCompanyForm({ ...companyForm, supportEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Invoice Prefix</label>
                  <input
                    type="text"
                    value={companyForm.invoicePrefix}
                    onChange={(e) => setCompanyForm({ ...companyForm, invoicePrefix: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Default Terms</label>
                  <input
                    type="text"
                    value={companyForm.defaultPaymentTerms}
                    onChange={(e) => setCompanyForm({ ...companyForm, defaultPaymentTerms: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Official Postal Address</label>
                <textarea
                  rows={2}
                  value={companyForm.billingAddress}
                  onChange={(e) => setCompanyForm({ ...companyForm, billingAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <Button variant="primary" type="submit" icon={Save}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tab: My Profile */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Personal Profile</CardTitle>
              <CardDescription>Your personal credentials and role assignments.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-16 h-16 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                A
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Admin</h3>
                <p className="text-slate-500">admin@brightloop.io</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700 mt-1">
                  Super Admin • Lead Developer
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Display Name</label>
                <input
                  type="text"
                  defaultValue="Admin"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">GitHub Account</label>
                <input
                  type="text"
                  defaultValue="brightloop-admin"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 font-mono"
                  readOnly
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Timezone</label>
                <input
                  type="text"
                  defaultValue="Asia/Kolkata (IST +05:30)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Two-Factor Authentication</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-4 h-4" /> Enabled (Hardware Key / Authenticator)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab: User Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Workspace Teammates</h3>
              <p className="text-xs text-slate-500">Collaborators with administrative or billing access.</p>
            </div>
            {isAdmin ? (
              <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsInviteModalOpen(true)}>
                Invite Staff Member
              </Button>
            ) : (
              <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg font-medium">
                Only the Admin can add new staff
              </span>
            )}
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-medium">
                    <th className="px-4 py-3">Member</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-900 block">{u.name}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{u.email}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{u.department}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3"><Badge status={u.status} /></td>
                      <td className="px-4 py-3 text-slate-400">{u.lastActive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Roles & Permission Overview */}
      {activeTab === 'roles' && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Role-Based Access Control (RBAC)</CardTitle>
              <CardDescription>Granular permission distribution matrix across subscription operations.</CardDescription>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-600 font-semibold">
                  <th className="px-4 py-3">Functional Module</th>
                  <th className="px-4 py-3 text-blue-700">Super Admin</th>
                  <th className="px-4 py-3 text-emerald-700">Billing Manager</th>
                  <th className="px-4 py-3 text-amber-700">Sales Rep</th>
                  <th className="px-4 py-3 text-slate-600">Support Lead</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roleMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-semibold text-slate-800">{item.module}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-medium rounded text-[10px]">
                        {item.superAdmin}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-medium rounded text-[10px]">
                        {item.billingManager}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 font-medium rounded text-[10px] ${
                        item.salesRep === 'No Access' ? 'bg-slate-100 text-slate-400' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {item.salesRep}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 font-medium rounded text-[10px] ${
                        item.supportLead === 'No Access' ? 'bg-slate-100 text-slate-400' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.supportLead}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Invite User Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite New Teammate"
        description="Grant dashboard access and assign functional roles."
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Elena Fisher"
              value={inviteForm.name}
              onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Work Email Address *</label>
            <input
              type="email"
              placeholder="elena@brightloop.io"
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Role</label>
              <select
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Billing Manager">Billing Manager</option>
                <option value="Sales Representative">Sales Representative</option>
                <option value="Customer Support Lead">Customer Support Lead</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Department</label>
              <input
                type="text"
                placeholder="Finance, Sales, Ops"
                value={inviteForm.department}
                onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
