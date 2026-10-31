import React, { useState } from 'react';
import { Plus, Download, Receipt, Calendar, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function InvoicesPage({ invoices, customers, onAddInvoice }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState(null);
  const [formData, setFormData] = useState({
    customer: customers[0]?.name || '',
    amount: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'Pending',
    description: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.customer) errs.customer = 'Customer is required';
    if (!formData.amount || Number(formData.amount) <= 0) errs.amount = 'Valid amount is required';
    if (!formData.dueDate) errs.dueDate = 'Payment due date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newInvoice = {
      id: `INV-2025-${String(invoices.length + 1088).padStart(4, '0')}`,
      customer: formData.customer,
      customerId: customers.find((c) => c.name === formData.customer)?.id || 'CUST-001',
      invoiceDate: formData.invoiceDate,
      dueDate: formData.dueDate,
      amount: parseFloat(formData.amount),
      status: formData.status,
      paymentMethod: 'Bank Wire / Card',
      items: [
        {
          desc: formData.description || 'Subscription Recurring Service Cycle',
          qty: 1,
          unit: parseFloat(formData.amount),
          total: parseFloat(formData.amount),
        },
      ],
    };

    onAddInvoice(newInvoice);
    setIsCreateModalOpen(false);
    setFormData({
      customer: customers[0]?.name || '',
      amount: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      status: 'Pending',
      description: '',
    });
    setErrors({});
  };

  const handleDownloadInvoice = (inv) => {
    setDownloadNotice(`Downloading PDF for invoice ${inv.id} (${inv.customer})...`);
    setTimeout(() => {
      setDownloadNotice(null);
    }, 3500);
  };

  const columns = [
    {
      header: 'Invoice #',
      accessor: 'id',
      cell: (row) => (
        <span className="font-semibold text-blue-600 font-mono flex items-center gap-1.5">
          <Receipt className="w-3.5 h-3.5 text-blue-500" /> {row.id}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer',
      cell: (row) => <span className="font-medium text-slate-800">{row.customer}</span>,
    },
    {
      header: 'Invoice Date',
      accessor: 'invoiceDate',
      cell: (row) => <span className="text-slate-600 text-[11px]">{formatDate(row.invoiceDate)}</span>,
    },
    {
      header: 'Due Date',
      accessor: 'dueDate',
      cell: (row) => <span className="text-slate-600 text-[11px]">{formatDate(row.dueDate)}</span>,
    },
    {
      header: 'Amount',
      accessor: 'amount',
      cell: (row) => <span className="font-bold text-slate-900">{formatCurrency(row.amount)}</span>,
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
              handleDownloadInvoice(row);
            }}
            className="h-8 px-2 text-slate-600 hover:text-blue-600"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5 mr-1" /> PDF
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Invoices & Billing</h1>
          <p className="text-xs text-slate-500">Track issued bills, recurring cycle invoices, and overdue receivables.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
          Create Invoice
        </Button>
      </div>

      {/* Download Alert Notification */}
      {downloadNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {downloadNotice}
          </span>
          <button onClick={() => setDownloadNotice(null)} className="text-emerald-700 font-bold">×</button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={invoices}
        searchKey="customer"
        searchPlaceholder="Search invoices by customer or ID..."
        filterOptions={['Paid', 'Pending', 'Overdue']}
        filterKey="status"
      />

      {/* Create Invoice Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Invoice"
        description="Issue an ad-hoc or cycle bill to a customer."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Customer *</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Invoice Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                placeholder="179.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.amount ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              {errors.amount && <p className="text-rose-500 text-[11px] mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Due Date *</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.dueDate ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              {errors.dueDate && <p className="text-rose-500 text-[11px] mt-1">{errors.dueDate}</p>}
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Line Item Description</label>
            <input
              type="text"
              placeholder="e.g. Monthly Recurring Subscription License"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Initial Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Invoice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
