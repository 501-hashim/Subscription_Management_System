import React, { useState } from 'react';
import { Plus, Percent, Tag, Calendar, CheckCircle2 } from 'lucide-react';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';

export function DiscountsPage({ discounts, onAddDiscount }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Percentage',
    value: '',
    applicableProducts: 'All Subscription Plans',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    usageLimit: 100,
    status: 'Active',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Discount coupon code is required';
    if (!formData.value.trim()) errs.value = 'Discount value is required (e.g. 20% or $50)';
    if (!formData.endDate) errs.endDate = 'End validity date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newDiscount = {
      id: `DISC-${String(discounts.length + 1).padStart(3, '0')}`,
      name: formData.name.toUpperCase().trim(),
      type: formData.type,
      value: formData.type === 'Percentage' && !formData.value.includes('%') ? `${formData.value}%` : formData.value,
      applicableProducts: formData.applicableProducts,
      startDate: formData.startDate,
      endDate: formData.endDate,
      usageLimit: parseInt(formData.usageLimit, 10) || 100,
      usedCount: 0,
      status: formData.status,
    };

    onAddDiscount(newDiscount);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      type: 'Percentage',
      value: '',
      applicableProducts: 'All Subscription Plans',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      usageLimit: 100,
      status: 'Active',
    });
    setErrors({});
  };

  const columns = [
    {
      header: 'Coupon Code',
      accessor: 'name',
      cell: (row) => (
        <span className="font-bold text-blue-600 font-mono tracking-wide flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-blue-500" /> {row.name}
        </span>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      cell: (row) => (
        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
          {row.type}
        </span>
      ),
    },
    {
      header: 'Value / Rate',
      accessor: 'value',
      cell: (row) => <span className="font-extrabold text-emerald-600">{row.value}</span>,
    },
    {
      header: 'Applicable Products',
      accessor: 'applicableProducts',
      cell: (row) => <span className="text-slate-600 truncate max-w-xs block">{row.applicableProducts}</span>,
    },
    {
      header: 'Active Period',
      accessor: 'startDate',
      cell: (row) => (
        <span className="text-slate-500 text-[11px]">
          {formatDate(row.startDate)} → {formatDate(row.endDate)}
        </span>
      ),
    },
    {
      header: 'Usage',
      accessor: 'usageLimit',
      cell: (row) => (
        <span className="text-slate-700 font-medium">
          {row.usedCount} / {row.usageLimit}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <Badge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Promotions & Discounts</h1>
          <p className="text-xs text-slate-500">Manage campaign coupon codes, recurring discounts, and seasonal offers.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
          Add Discount
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={discounts}
        searchKey="name"
        searchPlaceholder="Search coupon codes..."
        filterOptions={['Active', 'Expired']}
        filterKey="status"
      />

      {/* Add Discount Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Discount Code"
        description="Configure promotional campaigns and coupon redemption limits."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Coupon Code *</label>
              <input
                type="text"
                placeholder="e.g. FLASH25"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 uppercase font-mono ${
                  errors.name ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              {errors.name && <p className="text-rose-500 text-[11px] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Discount Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Fixed Amount">Fixed Amount ($)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Discount Value *</label>
              <input
                type="text"
                placeholder="e.g. 25% or 50.00"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.value ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              {errors.value && <p className="text-rose-500 text-[11px] mt-1">{errors.value}</p>}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Usage Limit</label>
              <input
                type="number"
                min="1"
                placeholder="500"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Applicable Products</label>
            <input
              type="text"
              placeholder="e.g. All Subscription Plans, or Core Suite"
              value={formData.applicableProducts}
              onChange={(e) => setFormData({ ...formData, applicableProducts: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">End Date *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.endDate ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              {errors.endDate && <p className="text-rose-500 text-[11px] mt-1">{errors.endDate}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Discount
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
