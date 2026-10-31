import React, { useState } from 'react';
import { Plus, Package, Layers, DollarSign } from 'lucide-react';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { formatCurrency } from '../../utils/formatters';

export function ProductsPage({ products, onAddProduct }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Service / SaaS',
    salesPrice: '',
    costPrice: '',
    variants: '',
    status: 'Available',
    description: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.salesPrice || Number(formData.salesPrice) <= 0) {
      errs.salesPrice = 'Valid sales price is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newProd = {
      id: `PROD-${String(products.length + 1).padStart(3, '0')}`,
      name: formData.name,
      code: formData.code || `BL-${formData.name.slice(0, 4).toUpperCase()}`,
      type: formData.type,
      salesPrice: parseFloat(formData.salesPrice),
      costPrice: formData.costPrice ? parseFloat(formData.costPrice) : 0,
      variants: formData.variants ? formData.variants.split(',').map((v) => v.trim()) : ['Default'],
      status: formData.status,
      description: formData.description,
    };

    onAddProduct(newProd);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      code: '',
      type: 'Service / SaaS',
      salesPrice: '',
      costPrice: '',
      variants: '',
      status: 'Available',
      description: '',
    });
    setErrors({});
  };

  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      cell: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.name}</span>
          <span className="text-[11px] font-mono text-slate-400">{row.code}</span>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      cell: (row) => (
        <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">
          {row.type}
        </span>
      ),
    },
    {
      header: 'Sales Price',
      accessor: 'salesPrice',
      cell: (row) => <span className="font-bold text-slate-900">{formatCurrency(row.salesPrice)}</span>,
    },
    {
      header: 'Cost Price',
      accessor: 'costPrice',
      cell: (row) => <span className="text-slate-500">{formatCurrency(row.costPrice)}</span>,
    },
    {
      header: 'Variants',
      accessor: 'variants',
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.variants?.map((v, i) => (
            <span
              key={i}
              className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded border border-blue-200"
            >
              {v}
            </span>
          ))}
        </div>
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
          <h1 className="text-lg font-bold text-slate-900">Products & Catalog</h1>
          <p className="text-xs text-slate-500">Configure recurring services, software modules, and product add-ons.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
          Add Product
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        searchKey="name"
        searchPlaceholder="Search products by title or code..."
        filterOptions={['Available', 'Archived']}
        filterKey="status"
      />

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Product"
        description="Add a billable service or subscription offering to your product matrix."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Product Name *</label>
              <input
                type="text"
                placeholder="e.g. Cloud Sync Connector"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              {errors.name && <p className="text-rose-500 text-[11px] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Product SKU / Code</label>
              <input
                type="text"
                placeholder="e.g. BL-SYNC"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Product Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Service / SaaS">Service / SaaS</option>
                <option value="Add-on License">Add-on License</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Service / SLA">Service / SLA</option>
                <option value="Integration">Integration</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Sales Price ($) *</label>
              <input
                type="number"
                step="0.01"
                placeholder="199.00"
                value={formData.salesPrice}
                onChange={(e) => setFormData({ ...formData, salesPrice: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.salesPrice ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              {errors.salesPrice && <p className="text-rose-500 text-[11px] mt-1">{errors.salesPrice}</p>}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Cost Price ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="40.00"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Variants (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Monthly, Annual, Enterprise Multi-node"
              value={formData.variants}
              onChange={(e) => setFormData({ ...formData, variants: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Product highlights and billing model description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Product
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
