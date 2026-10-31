import React, { useState } from 'react';
import { Plus, Eye, Mail, Building, Phone, Calendar, UserCheck } from 'lucide-react';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export function CustomersPage({ customers, onAddCustomer }) {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    address: '',
    status: 'Active',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Customer name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email';
    }
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newCustomer = {
      id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
      ...formData,
      totalSubscriptions: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    onAddCustomer(newCustomer);
    setIsAddModalOpen(false);
    setFormData({ name: '', email: '', company: '', phone: '', address: '', status: 'Active' });
    setErrors({});
  };

  const columns = [
    {
      header: 'Customer',
      accessor: 'name',
      cell: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.name}</span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Mail className="w-3 h-3 text-slate-300" /> {row.email}
          </span>
        </div>
      ),
    },
    {
      header: 'Company',
      accessor: 'company',
      cell: (row) => (
        <span className="text-slate-700 font-medium flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-slate-400" /> {row.company}
        </span>
      ),
    },
    {
      header: 'Active Subscriptions',
      accessor: 'totalSubscriptions',
      cell: (row) => (
        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
          {row.totalSubscriptions}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <Badge status={row.status} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCustomer(row);
            }}
            className="h-8 px-2 text-blue-600 hover:text-blue-700"
          >
            <Eye className="w-3.5 h-3.5 mr-1" /> View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Customers Directory</h1>
          <p className="text-xs text-slate-500">Manage client accounts, contracts, and subscription histories.</p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Customer
        </Button>
      </div>

      {/* Main Customers DataTable */}
      <DataTable
        columns={columns}
        data={customers}
        searchKey="name"
        searchPlaceholder="Search customers by name or email..."
        filterOptions={['Active', 'Inactive', 'Suspended']}
        filterKey="status"
        onRowClick={(row) => setSelectedCustomer(row)}
      />

      {/* View Customer Details Modal */}
      <Modal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.name || 'Customer Details'}
        description={`Customer ID: ${selectedCustomer?.id}`}
      >
        {selectedCustomer && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Company</span>
                <span className="font-semibold text-slate-800">{selectedCustomer.company}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Account Status</span>
                <Badge status={selectedCustomer.status} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Email Address</span>
                <span className="text-slate-700 font-mono">{selectedCustomer.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Phone</span>
                <span className="text-slate-700">{selectedCustomer.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Active Subscriptions</span>
                <span className="font-bold text-blue-600">{selectedCustomer.totalSubscriptions} plans</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Joined On</span>
                <span className="text-slate-700">{selectedCustomer.joinedDate}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Billing Address</span>
              <p className="text-slate-700 bg-white border border-slate-200 p-2.5 rounded-lg">
                {selectedCustomer.address || 'Standard Corporate Headquarters'}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Customer Modal Form */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Customer"
        description="Create a client profile for subscription provisioning and billing."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Customer Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Alex Morgan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-300 focus:ring-blue-500'
              }`}
            />
            {errors.name && <p className="text-rose-500 text-[11px] mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                placeholder="alex@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              {errors.email && <p className="text-rose-500 text-[11px] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Company Name *</label>
              <input
                type="text"
                placeholder="Acme Global Inc"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.company ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              {errors.company && <p className="text-rose-500 text-[11px] mt-1">{errors.company}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Account Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Billing Address</label>
            <textarea
              rows={2}
              placeholder="Full physical/postal billing address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Customer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
