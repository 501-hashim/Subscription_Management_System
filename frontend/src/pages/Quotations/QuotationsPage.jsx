import React, { useState } from 'react';
import { Plus, FileText, Send, Calendar, CheckCircle2 } from 'lucide-react';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function QuotationsPage({ quotations, customers, onAddQuotation }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer: customers[0]?.name || '',
    products: '',
    totalAmount: '',
    validityDate: '',
    status: 'Draft',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.customer) errs.customer = 'Customer is required';
    if (!formData.products.trim()) errs.products = 'Products / services are required';
    if (!formData.totalAmount || Number(formData.totalAmount) <= 0) errs.totalAmount = 'Valid total amount is required';
    if (!formData.validityDate) errs.validityDate = 'Validity expiration date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newQuotation = {
      id: `QT-2025-${String(quotations.length + 90).padStart(3, '0')}`,
      customer: formData.customer,
      customerId: customers.find((c) => c.name === formData.customer)?.id || 'CUST-001',
      products: formData.products,
      totalAmount: parseFloat(formData.totalAmount),
      validityDate: formData.validityDate,
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddQuotation(newQuotation);
    setIsCreateModalOpen(false);
    setFormData({
      customer: customers[0]?.name || '',
      products: '',
      totalAmount: '',
      validityDate: '',
      status: 'Draft',
    });
    setErrors({});
  };

  const columns = [
    {
      header: 'Quotation #',
      accessor: 'id',
      cell: (row) => (
        <span className="font-semibold text-blue-600 font-mono flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-blue-400" /> {row.id}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer',
      cell: (row) => <span className="font-medium text-slate-800">{row.customer}</span>,
    },
    {
      header: 'Products & Scope',
      accessor: 'products',
      cell: (row) => <span className="text-slate-600 truncate max-w-xs block">{row.products}</span>,
    },
    {
      header: 'Total Amount',
      accessor: 'totalAmount',
      cell: (row) => <span className="font-bold text-slate-900">{formatCurrency(row.totalAmount)}</span>,
    },
    {
      header: 'Validity Date',
      accessor: 'validityDate',
      cell: (row) => <span className="text-slate-600 text-[11px]">{formatDate(row.validityDate)}</span>,
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
          <h1 className="text-lg font-bold text-slate-900">Commercial Quotations</h1>
          <p className="text-xs text-slate-500">Draft, send, and convert pricing proposals into active recurring contracts.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
          Create Quotation
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={quotations}
        searchKey="customer"
        searchPlaceholder="Search quotations by customer..."
        filterOptions={['Draft', 'Sent', 'Accepted', 'Expired']}
        filterKey="status"
      />

      {/* Create Quotation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Generate New Quotation"
        description="Formal proposal ready to be exported or dispatched to prospective clients."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Select Customer *</label>
            <select
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.company})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Products / Subscription Packages *</label>
            <input
              type="text"
              placeholder="e.g. Growth Professional Plan + API Gateway"
              value={formData.products}
              onChange={(e) => setFormData({ ...formData, products: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.products ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-300 focus:ring-blue-500'
              }`}
            />
            {errors.products && <p className="text-rose-500 text-[11px] mt-1">{errors.products}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Total Quote Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                placeholder="499.00"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.totalAmount ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              {errors.totalAmount && <p className="text-rose-500 text-[11px] mt-1">{errors.totalAmount}</p>}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Valid Until *</label>
              <input
                type="date"
                value={formData.validityDate}
                onChange={(e) => setFormData({ ...formData, validityDate: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.validityDate ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              {errors.validityDate && <p className="text-rose-500 text-[11px] mt-1">{errors.validityDate}</p>}
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Initial Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Accepted">Accepted</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Quotation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
