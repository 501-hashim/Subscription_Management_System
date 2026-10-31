import React, { useState } from 'react';
import { Plus, Check, Layers, Users } from 'lucide-react';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { formatCurrency } from '../../utils/formatters';

export function PlansPage({ plans, onAddPlan }) {
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    billingFrequency: 'Monthly',
    minimumQuantity: 1,
    availabilityPeriod: 'Always Available',
    status: 'Active',
    features: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Plan name is required';
    if (!formData.price || Number(formData.price) <= 0) errs.price = 'Valid price is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newPlan = {
      id: `PLAN-${String(plans.length + 1).padStart(3, '0')}`,
      name: formData.name,
      code: `PLAN-${formData.name.slice(0, 3).toUpperCase()}`,
      price: parseFloat(formData.price),
      billingFrequency: formData.billingFrequency,
      minimumQuantity: parseInt(formData.minimumQuantity, 10) || 1,
      availabilityPeriod: formData.availabilityPeriod,
      status: formData.status,
      subscribersCount: 0,
      features: formData.features
        ? formData.features.split('\n').filter(Boolean)
        : ['Standard plan access', 'Email support'],
    };

    onAddPlan(newPlan);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      price: '',
      billingFrequency: 'Monthly',
      minimumQuantity: 1,
      availabilityPeriod: 'Always Available',
      status: 'Active',
      features: '',
    });
    setErrors({});
  };

  const columns = [
    {
      header: 'Plan Name',
      accessor: 'name',
      cell: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.name}</span>
          <span className="text-[11px] text-slate-400 font-mono">{row.code}</span>
        </div>
      ),
    },
    {
      header: 'Price',
      accessor: 'price',
      cell: (row) => (
        <span className="font-bold text-slate-900">
          {formatCurrency(row.price)}
          <span className="text-[10px] text-slate-400 font-normal"> / {row.billingFrequency.toLowerCase()}</span>
        </span>
      ),
    },
    {
      header: 'Billing Frequency',
      accessor: 'billingFrequency',
      cell: (row) => (
        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
          {row.billingFrequency}
        </span>
      ),
    },
    {
      header: 'Min Quantity',
      accessor: 'minimumQuantity',
      cell: (row) => <span className="text-slate-600">{row.minimumQuantity} user(s)</span>,
    },
    {
      header: 'Availability Period',
      accessor: 'availabilityPeriod',
      cell: (row) => <span className="text-slate-500 text-[11px]">{row.availabilityPeriod}</span>,
    },
    {
      header: 'Subscribers',
      accessor: 'subscribersCount',
      cell: (row) => (
        <span className="font-semibold text-blue-600 flex items-center gap-1">
          <Users className="w-3 h-3 text-blue-400" /> {row.subscribersCount}
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
          <h1 className="text-lg font-bold text-slate-900">Subscription Plans</h1>
          <p className="text-xs text-slate-500">Tier definitions, cadence parameters, and availability windows.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-0.5 rounded-lg flex text-xs">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                viewMode === 'cards' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                viewMode === 'table' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Table
            </button>
          </div>
          <Button variant="primary" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Add Plan
          </Button>
        </div>
      </div>

      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col justify-between ${
                plan.status === 'Active' ? 'border-slate-200 hover:border-blue-400' : 'opacity-70 border-dashed'
              }`}
            >
              <div>
                <CardHeader>
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    <span className="text-[11px] text-slate-400">{plan.availabilityPeriod}</span>
                  </div>
                  <Badge status={plan.status} />
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">{formatCurrency(plan.price)}</span>
                    <span className="text-xs text-slate-500 font-medium">/{plan.billingFrequency.toLowerCase()}</span>
                  </div>

                  <div className="text-xs text-slate-600 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span>Min seats: <strong className="text-slate-800">{plan.minimumQuantity}</strong></span>
                    <span>•</span>
                    <span>Active users: <strong className="text-blue-600">{plan.subscribersCount}</strong></span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600">
                    {plan.features?.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>

              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">{plan.id}</span>
                <Button variant="secondary" size="sm" onClick={() => setIsAddModalOpen(true)}>
                  Edit Tier
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={plans}
          searchKey="name"
          searchPlaceholder="Search plans..."
          filterOptions={['Active', 'Archived']}
          filterKey="status"
        />
      )}

      {/* Add Plan Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Subscription Plan"
        description="Configure pricing, billing intervals, and customer entitlements."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Plan Name *</label>
            <input
              type="text"
              placeholder="e.g. Enterprise Team Scale"
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
              <label className="block font-medium text-slate-700 mb-1">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                placeholder="249.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.price ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              {errors.price && <p className="text-rose-500 text-[11px] mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Billing Frequency</label>
              <select
                value={formData.billingFrequency}
                onChange={(e) => setFormData({ ...formData, billingFrequency: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annual">Annual</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Minimum Quantity (Seats)</label>
              <input
                type="number"
                min="1"
                value={formData.minimumQuantity}
                onChange={(e) => setFormData({ ...formData, minimumQuantity: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Availability Window</label>
              <input
                type="text"
                placeholder="Always Available, or Q4 2025"
                value={formData.availabilityPeriod}
                onChange={(e) => setFormData({ ...formData, availabilityPeriod: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Key Features (one per line)</label>
            <textarea
              rows={3}
              placeholder="e.g.&#10;Up to 50 active projects&#10;Dedicated account manager&#10;99.9% uptime SLA"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Plan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
